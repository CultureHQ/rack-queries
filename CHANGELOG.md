# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2019-05-17

### Added

- The ability to name queries and add descriptions.

### Changed

- Better focus indicators in the UI (not just default outline).

## [0.1.3] - 2019-03-01

### Changed

- Move the middlewares before the static handler so that auth middlewares can handle the request before files like the index are returned.
- More properly handle nesting the rack application under a script name such that you can visit `/queries` and not just `/queries/`.

## [0.1.2] - 2019-02-27

### Changed

- Use relative paths for the static assets so that when the app is mounted it will be prefixed with the mounting path.

## [0.1.1] - 2019-02-27

### Changed

- Changed the require paths for easier integration with bundler.

## [0.1.0] - 2019-02-27

### Added

- Initial release 🎉

[unreleased]: https://github.com/CultureHQ/rack-queries/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/CultureHQ/rack-queries/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/CultureHQ/rack-queries/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/CultureHQ/rack-queries/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/CultureHQ/rack-queries/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/CultureHQ/rack-queries/compare/f4f0b2...v0.1.0
