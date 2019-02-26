# frozen_string_literal: true

require 'forwardable'
require 'json'
require 'rack'

require 'queries/app'
require 'queries/cache'
require 'queries/version'

module Rack
  module Queries
    def self.add(*queries)
      Cache.add(*queries)
    end
  end
end
