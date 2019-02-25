#!/usr/bin/env ruby

require 'bundler/setup'
require 'rack'

$:.unshift(File.expand_path(File.join('lib'), __dir__))
require 'query_page'

class UserCountQuery < QueryPage::Query
  def run
    5
  end
end

class UserActiveCountQuery < QueryPage::Query
  def run
    6
  end
end

Rack::Server.start(app: QueryPage::App, server: 'webrick')
