# frozen_string_literal: true

module Rack
  module Queries
    class Cache
      attr_reader :cache

      def initialize
        @cache = []
      end

      def add(*queries)
        @cache = (cache + queries).sort_by(&:name)
      end

      def opts_for(name, opt)
        query = query_for(name)
        return unless query

        instance = query.new
        instance.public_send(opt) if instance.respond_to?(opt)
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
  end
end