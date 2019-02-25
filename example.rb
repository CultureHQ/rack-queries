#!/usr/bin/env ruby

require 'bundler/setup'
require 'rack'
require 'sqlite3'

$:.unshift(File.expand_path(File.join('lib'), __dir__))
require 'query_page'

class Database
  attr_reader :db

  def initialize
    @db = SQLite3::Database.new(':memory:')

    DATA.read.split(';')[0...-1].each do |query|
      db.execute(query)
    end
  end

  def value_from(query)
    db.execute(query)[0][0]
  end

  class << self
    def value_from(query)
      instance.value_from(query)
    end

    private

    def instance
      @instance ||= new
    end
  end
end

class OrgCountQuery < QueryPage::Query
  def run
    Database.value_from('SELECT COUNT(*) FROM orgs')
  end
end

class UserCountQuery < QueryPage::Query
  def run
    Database.value_from('SELECT COUNT(*) FROM users')
  end
end

Rack::Server.start(app: QueryPage::App, server: 'webrick')

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
  (2, 1, "Kelly Kapoor"),
  (2, 1, "Kevin Malone"),
  (2, 1, "Ryan Howard"),
  (2, 0, "Roy Anderson");
