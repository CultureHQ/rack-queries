# frozen_string_literal: true

require 'json'
require 'rack'
require 'query_page/version'

module QueryPage
  class QueryCache
    attr_reader :cache

    def initialize
      @cache = []
    end

    def <<(query)
      cache << query
    end

    def self.instance
      @instance ||= new
    end
  end

  class Query
    def self.inherited(query)
      QueryCache.instance << query
    end
  end

  module App
    class Controller
      def call(env)
        request = Rack::Request.new(env)

        if request.get? && request.path == '/queries'
          json(queries: QueryCache.instance.cache.map(&:name))
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
            use Rack::Static, urls: %w[/js], root: STATIC, index: 'index.html'
            run Controller.new
          end
      end
    end
  end
end
