# frozen_string_literal: true

lib = File.expand_path('lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rack/queries/version'

Gem::Specification.new do |spec|
  spec.name          = 'rack-queries'
  spec.version       = Rack::Queries::VERSION
  spec.authors       = ['Kevin Deisz']
  spec.email         = ['kevin.deisz@gmail.com']

  spec.summary       = 'A page in your app for pre-built queries'
  spec.homepage      = 'https://github.com/CultureHQ/rack-queries'
  spec.license       = 'MIT'

  spec.files         =
    Dir.chdir(__dir__) do
      `git ls-files -z`.split("\x0").grep_v(%r{^(src|test|node_modules)/})
    end

  spec.bindir        = 'exe'
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler', '~> 2.0'
  spec.add_development_dependency 'bundler-audit', '~> 0.6'
  spec.add_development_dependency 'minitest', '~> 5.0'
  spec.add_development_dependency 'rack', '~> 2.0'
  spec.add_development_dependency 'rack-test', '~> 1.1'
  spec.add_development_dependency 'rake', '~> 13.0'
  spec.add_development_dependency 'rubocop', '~> 0.72'
  spec.add_development_dependency 'simplecov', '~> 0.16'
  spec.add_development_dependency 'sqlite3', '~> 1.4'
end
