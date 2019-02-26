#!/usr/bin/env ruby

require 'bundler/setup'
require 'forwardable'
require 'rack'
require 'sqlite3'

$:.unshift(File.expand_path(File.join('lib', 'rack'), __dir__))
require 'queries'

class Database
  class IncomprehensibleReturnValueError < ArgumentError
    def initialize(*)
      super('SQLite3 return value not understood')
    end
  end

  attr_reader :db

  def initialize
    @db = SQLite3::Database.new(':memory:')

    DATA.read.split(';')[0...-1].each do |query|
      db.execute(query)
    end
  end

  def value_from(query, binds = [])
    results = execute(query, binds)

    case results
    when Array
      results[0][0]
    when SQLite3::ResultSet
      results.next[0]
    else
      raise IncomprehensibleReturnValueError
    end
  end

  def values_from(query, binds = [])
    execute(query, binds).map(&:first)
  end

  class << self
    def instance
      @instance ||= new
    end

    extend Forwardable
    def_delegators :instance, :value_from, :values_from
  end

  private

  def execute(query, binds)
    return db.execute(query) if binds.empty?

    stmt = db.prepare(query)
    stmt.execute(binds)
  end
end

module Queries
  class OrgCountQuery
    def run(opts)
      Database.value_from('SELECT COUNT(*) FROM orgs')
    end
  end

  class OrgUsersCountQuery
    def org_name
      Database.values_from('SELECT name FROM orgs')
    end

    def run(opts)
      query = <<~SQL
        SELECT COUNT(*) FROM users
        WHERE org_id = (SELECT id FROM orgs WHERE name = :org_name)
      SQL

      Database.value_from(query, opts)
    end
  end

  class OrgActiveUsersCountQuery
    def org_name
      Database.values_from('SELECT name FROM orgs')
    end

    def run(opts)
      query = <<~SQL
        SELECT COUNT(*) FROM users
        WHERE org_id = (SELECT id FROM orgs WHERE name = :org_name)
        AND active = 1
      SQL

      Database.value_from(query, opts)
    end
  end

  class UserCountQuery
    def run(opts)
      Database.value_from('SELECT COUNT(*) FROM users')
    end
  end
end

Rack::Queries.add(
  Queries::OrgCountQuery,
  Queries::OrgUsersCountQuery,
  Queries::OrgActiveUsersCountQuery,
  Queries::UserCountQuery
)

Rack::Server.start(app: Rack::Queries::App, server: 'webrick')

__END__
CREATE TABLE orgs (
  id INTEGER,
  name VARCHAR(255),
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id INTEGER,
  org_id INTEGER,
  active BOOLEAN NOT NULL,
  name VARCHAR(255),
  PRIMARY KEY(id)
);

INSERT INTO orgs(name) VALUES
  ("Parks and Recreation"),
  ("Dunder Mifflin");

INSERT INTO users(org_id, active, name) VALUES
  (1, 1, "Leslie Knope"),
  (1, 1, "Ron Swanson"),
  (1, 1, "April Ludgate"),
  (1, 1, "Andy Dwyer"),
  (1, 1, "Ben Wyatt"),
  (1, 1, "Tom Haverford"),
  (1, 1, "Donna Meagle"),
  (1, 0, "Jerry Gergich"),
  (2, 1, "Michael Scott"),
  (2, 1, "Pam Beesley"),
  (2, 1, "Jim Halpert"),
  (2, 1, "Dwight Schrute"),
  (2, 1, "Angela Martin"),
  (2, 1, "Andy Bernard"),
  (2, 1, "Kevin Malone"),
  (2, 0, "Roy Anderson"),
  (2, 1, "Kelly Kapoor"),
  (2, 1, "Ryan Howard");
