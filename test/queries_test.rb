# frozen_string_literal: true

require 'test_helper'

class QueriesTest < Minitest::Test
  def test_version
    refute_nil Rack::Queries::VERSION
  end
end
