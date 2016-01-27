# Javascript clients for Apache Thrift

An implementation of binary transports and protocols for JavaScript Thrift library,
as well as some modifications to generated Thrift code to create a better modern
JavaScript API using the bluebird Promises library.

Authors: 

* Most of the code lifted out of other projects:
    - The binary protocol was lifted from Radoslaw Gruchalski's project
    - The XMLHttpRequest and other transports extracted from the Thrift core
* KBase authors
    - Erik Pearson (almost all of the code and tests)
    - Dan Gunter (some additional tests, and the TravisCI/Codecov setup)

## Installation

From source:

1. Clone the repository on github into a local directory

        git clone https://github.com/kbase/kbase-data-thrift-js.git

2.  Install with Node Package Manager (npm)

        cd kbase-data-thrift-js
        npm install

## Testing

There is a test framework in place, using Karma and Jasmine. There are tests for writing and reading basic types to an "echo" transport.

Run tests: `karma start test/karma.conf.js`

## Adding a new package (dependency )

Every time you add a new dependency, you need to modify three files. For example, let's say you're installing the `bluebird` JS package for its Promise support. Then:

1.a. Add the package to the "devDependencies" property in `bower.json`:

        "bluebird": "2.10.2",

1.b. Now you can install the package:

     $ bower install

2. Add bluebird to the "paths" property in `main-test.js`:

        bluebird: 'bower_components/bluebird/js/browser/bluebird',

3. Add bluebird to the "files" property in `karma.conf.js`:
      
        {pattern: 'bower_components/bluebird/js/browser/bluebird.js', included: false},

## Features

- protocols:
    - binary
    - json
- transports
    - xhr
    - websocket
    - echo
- testing
- documentation

## History

Most of the code lifted out of other projects:
    - The binary protocol was lifted from Radoslaw Gruchalski's project
    - The XMLHttpRequest and other transports extracted from the Thrift core

The echo transport is our own contribution. It is for testing.

As we began to integrate the Thrift javascript client for our service apis, it was discovered that the javascript components in both the Thrift core, as well as the most advanced binary protocol implementation, both suffered from problems. The Thrift core javascript libraries were too intertwined, and were packaged in a single library containing code that would never be used or tested.

At the moment (delete this when no longer true!) just the binary protocol, xhr transport, and echo transport are used and supported. The json protocol and websocket transports should be brought up to speed. It is unknown if the websocket implementation really works.

## Future 

Since this is the bedrock of Javascript thrift clients, it needs to be tested, stable, and performant. Our testing needs to reflect and encourage these characterstics. To that end, we still have work to do! In order to test and excercise the transports, we need a service and api implementation to run against. This would probably best be implemented in this project as a nodejs, to reduce the extra dependencies of, say, a python service.


## Running tests

Use Grunt to run Karma tests:

    grunt test    

