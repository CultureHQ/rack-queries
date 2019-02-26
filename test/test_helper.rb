# frozen_string_literal: true

require 'simplecov'
SimpleCov.start

$LOAD_PATH.unshift File.expand_path(File.join('..', 'lib', 'rack'), __dir__)
require 'queries'
require 'rack/test'

require 'minitest/autorun'
