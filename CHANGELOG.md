# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.4] - 2017-09-02
### Fixed
- user style support for CSS or LESS

## [2.0.3] - 2017-08-30
### Fixed
- bug giving incorrect path when atom started in another directory

## [2.0.2] - 2017-08-29
### Added
- fallback conversion module

## [2.0.0] - 2017-08-27
### Changed
- upgraded converting engine to [mdpdf](https://github.com/bluehatbrit/mdpdf)

### Removed
- large file timeout
- png and jpeg options
- page orientation
- reduced quality option
- dirty hacks with image conversion (may need to re-add; will wait for issues)
