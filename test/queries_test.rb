# frozen_string_literal: true

require 'test_helper'

class Middleware
  class Logger
    attr_reader :lines

    def initialize
      @lines = []
    end

    def info(line)
      lines << line
    end

    def self.instance
      @instance ||= new
    end
  end

  attr_reader :app, :logger

  def initialize(app, logger)
    @app = app
    @logger = logger
  end

  def call(env)
    app.call(env).tap { logger.info(env['PATH_INFO']) }
  end

  Rack::Queries::App.use(self, Logger.instance)
end

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

  class UserCountQuery
    def run(_opts)
      USERS.values.sum(&:size)
    end

    Rack::Queries.add(self)
  end

  class UsersWhoseNameStartWithAQuery
    def org_name
      USERS.keys
    end

    def run(opts)
      USERS[opts['org_name']].count { |user| user.start_with?('A') }
    end

    Rack::Queries.add(self)
  end

  Rack::Queries.create do
    name 'UserNamesQuery'
    desc 'The names of all the users in an organization'

    opt :org_name do
      USERS.keys
    end

    run do |opts|
      USERS[opts['org_name']]
    end
  end

  Rack::Queries.create do
    name 'UserSearchQuery'
    desc 'Search for a user by name'

    opt :org_name do
      USERS.keys
    end

    opt :user_name, type: :string

    run do |opts|
      matched =
        USERS[opts['org_name']].select do |user|
          user.start_with?(opts['user_name'])
        end

      [%w[Name]] + matched.map { |user| [user] }
    end
  end
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
    assert_equal 4, json['queries'].size
  end

  def test_query_opt
    get '/queries/UserNamesQuery/opts/org_name'

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
    get '/queries/UserNamesQuery', org_name: org_name

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

  def test_middleware_gets_called
    path = '/queries/Queries::UserCountQuery'
    get path

    assert_equal path, Middleware::Logger.instance.lines.last
  end

  def test_fail_to_create_due_to_wrong_type
    assert_raises ArgumentError do
      Rack::Queries.create do
        opt(:foo, type: :string) {}
      end
    end
  end

  def test_allows_sending_values_for_other_option_types
    org_name = 'Parks and Recreation'
    user_name = 'A'

    get '/queries/UserSearchQuery', org_name: org_name, user_name: user_name

    assert last_response.ok?

    expected = ['April Ludgate', 'Andy Dwyer']
    assert_empty expected - json['results'][1..-1].flatten
  end

  def test_maps_public_instance_methods_onto_options
    org_name = 'Parks and Recreation'

    get '/queries/Queries::UsersWhoseNameStartWithAQuery', org_name: org_name

    assert last_response.ok?
    assert_equal 2, json['results'].to_i
  end

  private

  def app
    Rack::Queries::App
  end

  def json
    JSON.parse(last_response.body)
  end
end
