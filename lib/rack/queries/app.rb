# frozen_string_literal: true

module Rack
  module Queries
    module App
      class Controller
        def call(env)
          request = Request.new(env)
          return not_found unless request.get?

          case request.path
          when '/queries'
            json(queries: Cache.queries)
          when %r{\A/queries/([a-z0-9_\-:]+)\z}i
            query = Cache.query_for($1)
            query ? json(results: query.new.run(request.params)) : not_found
          when %r{\A/queries/([a-z0-9_\-:]+)/opts/([a-z0-9_]+)\z}i
            values = Cache.opts_for($1, $2)
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

      class Static
        STATIC = ::File.expand_path('static', __dir__)
        FILES =
          Dir[::File.join(STATIC, '*')].map do |path|
            "/#{::File.basename(path)}"
          end

        attr_reader :app, :server

        def initialize(app)
          @app = app
          @server = File.new(STATIC)
        end

        def call(env)
          env[PATH_INFO] = '/index.html' if env[PATH_INFO] == '/'
          (FILES.include?(env[PATH_INFO]) ? server : app).call(env)
        end
      end

      class << self
        def call(env)
          app.call(env)
        end

        private

        def app
          @app ||=
            Builder.new do
              use Static
              run Controller.new
            end
        end
      end
    end
  end
end