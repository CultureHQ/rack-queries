# frozen_string_literal: true

require 'test_helper'

module Queries
  USERS = {
    'Parks and Recreation' => [
      'Leslie Knope',
      'Ron Swanson',
      'April Ludgate',
      'Andy Dwyer',
      'Ben Wyatt'
    ],
    'Dunder Mifflin' => [
      'Michael Scott',
      'Pam Beesley',
      'Jim Halpert',
      'Dwight Schrute',
      'Angela Martin'
    ]
  }.freeze

  class UserNamesQuery
    def org_name
      USERS.keys
    end

    def run(opts)
      USERS[opts['org_name']]
    end
  end

  class UserCountQuery
    def run(_opts)
      USERS.values.sum(&:size)
    end
  end

  Rack::Queries.add(UserNamesQuery, UserCountQuery)
end

class QueriesTest < Minitest::Test
  include Rack::Test::Methods

  STATIC_FILES = {
    '/' => 'text/html',
    '/app.css' => 'text/css',
    '/app.js' => 'application/javascript',
    '/favicon.ico' => 'image/vnd.microsoft.icon'
  }.freeze

  def test_static
    STATIC_FILES.each do |name, media_type|
      get name

      assert last_response.ok?
      assert_equal media_type, last_response.media_type
    end
  end

  def test_version
    refute_nil Rack::Queries::VERSION
  end

  def test_index
    get '/'

    assert last_response.ok?
    assert_equal 'text/html', last_response.media_type
  end

  def test_queries
    get '/queries'

    assert last_response.ok?
    assert_equal 2, json['queries'].size
  end

  def test_query_opt
    get '/queries/Queries::UserNamesQuery/opts/org_name'

    assert last_response.ok?
    assert_equal 2, json['values'].size
  end

  def test_query_no_params
    get '/queries/Queries::UserCountQuery'

    assert last_response.ok?
    assert_equal Queries::USERS.values.sum(&:size), json['results'].to_i
  end

  def test_query_with_params
    org_name = 'Dunder Mifflin'
    get '/queries/Queries::UserNamesQuery', org_name: org_name

    assert last_response.ok?
    assert_equal Queries::USERS[org_name], json['results']
  end

  def test_not_found
    get '/foobar'

    assert last_response.not_found?
  end

  def test_query_not_found
    get '/queries/foobar'

    assert last_response.not_found?
  end

  def test_query_opt_not_found
    get '/queries/Queries::UserNamesQuery/opts/foobar'

    assert last_response.not_found?
  end

  private

  def app
    Rack::Queries::App
  end

  def json
    JSON.parse(last_response.body)
  end
end
