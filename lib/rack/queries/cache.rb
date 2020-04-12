# frozen_string_literal: true

module Rack
  module Queries
    class Cache
      class Option < Struct.new(:name, :type)
        def as_json
          { name: name, type: type }
        end
      end

      class SelectOption < Struct.new(:name)
        def as_json
          { name: name, type: 'select' }
        end
      end

      class CreateQuery
        class << self
          def name(name = :get)
            if name == :get
              @name
            else
              @name = name
            end
          end

          def desc(desc = :get)
            if desc == :get
              @desc
            else
              @desc = desc
            end
          end

          def opts
            @opts ||= {}
          end

          def opt(name, type: :select, &block)
            if type != :select && block
              raise ArgumentError, 'Can only specify a block if it is a select'
            end

            if type == :select
              define_method(name, &block)
              opts[name.to_s] = SelectOption.new(name)
            else
              opts[name.to_s] = Option.new(name, type)
            end
          end

          def run(&block)
            define_method(:run, &block)
          end
        end
      end

      attr_reader :cache

      def initialize
        @cache = []
      end

      def add(*queries)
        queries.each do |query|
          opts = {}

          (query.public_instance_methods(false) - %i[run]).each do |name|
            opts[name] = SelectOption.new(name)
          end

          query.define_singleton_method(:opts) { opts }
        end

        @cache = (cache + queries).sort_by(&:name)
      end

      def create(&block)
        query = Class.new(CreateQuery, &block)
        @cache = (cache << query).sort_by(&:name)
      end

      def opts_for(name, opt)
        query = query_for(name)
        query.new.public_send(opt) if query
      end

      def queries
        cache.map do |query|
          desc = query.respond_to?(:desc) ? query.desc : ''
          opts =
            query.respond_to?(:opts) ? query.opts.values.map(&:as_json) : []

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
