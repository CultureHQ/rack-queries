# frozen_string_literal: true

require 'rack'
require 'query_page/version'

module QueryPage
  module App
    class QueriesController
      def call(env)
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
            use Rack::Static, urls: [''], root: STATIC, index: 'index.html'
            run QueriesController.new
          end
      end
    end
  end
end
