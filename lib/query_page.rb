# frozen_string_literal: true

require 'forwardable'
require 'json'
require 'rack'
require 'query_page/version'

module QueryPage
  class QueryCache
    attr_reader :cache

    def initialize
      @cache = []
    end

    def add(*queries)
      @cache = (cache + queries).sort_by(&:name)
    end

    def opts_for(name, opt)
      query = query_for(name)
      query.new.public_send(opt) if query
    end

    def queries
      cache.map do |query|
        opts = query.public_instance_methods(false) - %i[run]
        { name: query.name, opts: opts }
      end
    end

    def query_for(name)
      cache.detect { |query| query.name == name }
    end

    class << self
      def instance
        @instance ||= new
      end

      extend Forwardable
      def_delegators :instance, :add, :opts_for, :queries, :query_for
    end
  end

  def self.add(*queries)
    QueryCache.add(*queries)
  end

  module App
    class Controller
      def call(env)
        request = Rack::Request.new(env)
        return not_found unless request.get?

        case request.path
        when '/queries'
          json(queries: QueryCache.queries)
        when %r{\A/queries/([a-z0-9_\-:]+)\z}i
          query = QueryCache.query_for($1)
          query ? json(results: query.new.run(request.params)) : not_found
        when %r{\A/queries/([a-z0-9_\-:]+)/opts/([a-z0-9_]+)\z}i
          values = QueryCache.opts_for($1, $2)
          values ? json(values: values) : not_found
        else
          not_found
        end
      end

      private

      def json(body)
        [200, { 'Content-Type' => 'application/json' }, [JSON.dump(body)]]
      end

      def not_found
        [404, { 'Content-Type' => 'text/plain' }, ['Not Found']]
      end
    end

    STATIC = -File.expand_path(File.join('query_page', 'static'), __dir__)

    class << self
      def call(env)
        app.call(env)
      end

      private

      def app
        @app ||=
          Rack::Builder.new do
            use Rack::Static, urls: %w[/js /css], root: STATIC, index: 'index.html'
            run Controller.new
          end
      end
    end
  end
end
