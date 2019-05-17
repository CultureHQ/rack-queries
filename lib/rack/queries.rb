# frozen_string_literal: true

require 'forwardable'
require 'json'
require 'rack'

require 'rack/queries/app'
require 'rack/queries/cache'
require 'rack/queries/version'

module Rack
  module Queries
    def self.add(*queries)
      Cache.add(*queries)
    end

    def self.create(&block)
      Cache.create(&block)
    end
  end
end
