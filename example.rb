#!/usr/bin/env ruby

require 'bundler/setup'
require 'rack'

$:.unshift(File.expand_path(File.join('lib'), __dir__))
require 'query_page'

class UserCountQuery < QueryPage::Query; end

class UserActiveCountQuery < QueryPage::Query; end

Rack::Server.start(app: QueryPage::App, server: 'webrick')
