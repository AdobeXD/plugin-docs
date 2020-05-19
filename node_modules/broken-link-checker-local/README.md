# broken-link-checker-local

> Find broken links, missing images, etc in your HTML, even in local files.

[![CircleCI](https://circleci.com/gh/LukasHechenberger/broken-link-checker-local.svg?style=shield&circle-token=5f7572151da460505166029bdfeefbc32d6bc720)](https://circleci.com/gh/LukasHechenberger/broken-link-checker-local)
[![codecov](https://codecov.io/gh/LukasHechenberger/broken-link-checker-local/branch/master/graph/badge.svg?token=dPgjdXipFF)](https://codecov.io/gh/LukasHechenberger/broken-link-checker-local)
[![API Docs](https://lukashechenberger.github.io/broken-link-checker-local/badge.svg)](https://lukashechenberger.github.io/broken-link-checker-local/)
[![Greenkeeper badge](https://badges.greenkeeper.io/LukasHechenberger/broken-link-checker-local.svg)](https://greenkeeper.io/)

Just a tiny wrapper around [broken-link-checker](https://github.com/stevenvachon/broken-link-checker) by [stevenvachon](https://github.com/stevenvachon) that allows you to check **local directories** for broken links.

## Installation

With Node.js (version 6 or higher) installed, run

```npm install -g broken-link-checker-local```

to install this module globally.

## Usage

> All commands of [broken-link-checker](https://github.com/stevenvachon/broken-link-checker) can be used in exactly the same way with this module. The only difference is that **broken-link-checker-local is available as `blcl`**.

In addition to running checks on URLs by running

```blcl http://yoursite.com -ro```

you can also check local directories by providing a path instead of a URL:

```blcl ./path/to/directory -ro```

You can run `blcl --help` to check for available options.
