# Ember template [![Build status](https://travis-ci.org/alexpearce/ember-template.svg)](http://travis-ci.org/alexpearce/ember-template)

A template for getting started with [Ember.js](http://emberjs.com/) development.

This template is based off of the [Yeoman](http://yeoman.io/) [Ember generator](https://github.com/yeoman/generator-ember), but modified to suite my tastes.

For an example of an application built using this template, see [Finances](https://github.com/alexpearce/finances).

## Getting started

First, you'll want to make sure you already have everything listed in the [Dependencies](#dependencies) section.
Once that's done, you just need to clone this repository and install some [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) packages.

```bash
$ git clone https://github.com/alexpearce/ember-template.git
$ cd ember-template
$ npm install
$ bower install
$ bundle exec grunt serve
```

The `grunt serve` call will start a development server and open the index page in your browser.

## Dependencies

The following are necessary to run the development server.

* [Node.js](http://nodejs.org/)
* [Bower](http://bower.io/) and the [Grunt CLI](https://www.npmjs.org/package/grunt-cli) (install them globally with `npm install -g bower grunt-cli`)
* [Compass](http://compass-style.org/) for [SASS](http://sass-lang.com/) compilation and nice mixins

One way of mixing Ruby and Node is with a [Gemfile](Gemfile), locally installing the Compass gem.

```bash
$ bundle install --path=vendor/bundle
```

To run the application and have it be aware of the available local gems, do

```bash
$ bundle exec grunt serve
```

If you want to skip this `bundle exec` stuff, just install Compass globally with `gem install compass`.
This README assumes you are using local gems.

## Testing

To run the test suite locally, the test dependencies need to be install.

```bash
$ cd tests
$ bower install
$ cd ..
```

The tests can then be run.

```
$ bundle exec grunt test
```

See the [`travis.yml`](.travis.yml) file for [TravisCI](https://travis-ci.org/) configuration.
