# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased
- show user-facing error message when no editor available

## [2.3.2]
### Changed
- bump mdpdf version (fix tmpfile path proble)

## [2.3.1]
### Added
- add orientation support
- add "Open settings" command

### Changed
- change keymaps

### Fixed
- error when missing stylesheet in default path

## [2.3.0]
### Changed
- use newer version of mdpdf (puppeteer)

## [2.0.4]
### Fixed
- user style support for CSS or LESS

## [2.0.3]
### Fixed
- bug giving incorrect path when atom started in another directory

## [2.0.2]
### Added
- fallback conversion module

## [2.0.0]
### Changed
- upgraded converting engine to [mdpdf](https://github.com/bluehatbrit/mdpdf)

### Removed
- large file timeout
- png and jpeg options
- page orientation
- reduced quality option
- dirty hacks with image conversion (may need to re-add; will wait for issues)
