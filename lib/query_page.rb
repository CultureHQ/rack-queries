# frozen_string_literal: true

require 'forwardable'
require 'json'
require 'rack'

require 'query_page/app'
require 'query_page/cache'
require 'query_page/version'

module QueryPage
  def self.add(*queries)
    Cache.add(*queries)
  end
end
