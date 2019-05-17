# frozen_string_literal: true

module Rack
  module Queries
    module App
      class Controller
        # Thought about refactoring this to split it out into multiple objects,
        # but then thought better of it. If we end up adding more API endpoints
        # then we can do something smart about it, but for now it's fine.
        # rubocop:disable AbcSize, CyclomaticComplexity, MethodLength
        def call(env)
          return not_found unless env[REQUEST_METHOD]

          case Utils.unescape(env[PATH_INFO])
          when %r{\A/queries/(.+)/opts/(.+)\z}i
            values = Cache.opts_for($1, $2)
            values ? json(values: values) : not_found
          when %r{\A/queries/(.+)\z}i
            query = Cache.query_for($1)
            return not_found unless query

            params = Request.new(env).params
            json(results: query.new.run(params))
          when '/queries'
            json(queries: Cache.queries)
          else
            not_found
          end
        end
        # rubocop:enable AbcSize, CyclomaticComplexity, MethodLength

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
          if env[PATH_INFO] == '/'
            render_index(env)
          elsif FILES.include?(env[PATH_INFO])
            server.call(env)
          else
            app.call(env)
          end
        end

        private

        def render_index(env)
          content = ::File.read(::File.join(STATIC, 'index.html.erb'))
          script_name = env[SCRIPT_NAME]

          result = ERB.new(content).result_with_hash(script_name: script_name)

          [200, { 'Content-Type' => 'text/html' }, [result]]
        end
      end

      class << self
        def middlewares
          @middlewares ||= []
        end

        def use(*args, &block)
          middlewares << [args, block]
        end

        def call(env)
          app.call(env)
        end

        private

        def app
          @app ||= build_app
        end

        def build_app
          configurations = middlewares

          Builder.new do
            configurations.each do |middleware, block|
              use(*middleware, &block)
            end
            use Static
            run Controller.new
          end
        end
      end
    end
  end
end
