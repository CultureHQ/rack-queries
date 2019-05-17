# frozen_string_literal: true

module Rack
  module Queries
    class Cache
      class CreateQuery
        def self.name(name = :get)
          if name == :get
            @name
          else
            @name = name
          end
        end

        def self.desc(desc = :get)
          if desc == :get
            @desc
          else
            @desc = desc
          end
        end

        def self.opt(name, &block)
          define_method(name, &block)
        end

        def self.run(&block)
          define_method(:run, &block)
        end
      end

      attr_reader :cache

      def initialize
        @cache = []
      end

      def add(*queries)
        @cache = (cache + queries).sort_by(&:name)
      end

      def create(&block)
        query = Class.new(CreateQuery, &block)
        @cache = (cache << query).sort_by(&:name)
      end

      def opts_for(name, opt)
        query = query_for(name)
        return unless query

        instance = query.new
        instance.public_send(opt) if instance.respond_to?(opt)
      end

      def queries
        cache.map do |query|
          desc = query.respond_to?(:desc) ? query.desc : ''
          opts = query.public_instance_methods(false) - %i[run]

          { name: query.name, desc: desc, opts: opts }
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
        def_delegators :instance, :add, :create, :opts_for, :queries, :query_for
      end
    end
  end
end
