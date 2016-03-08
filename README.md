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

Use Grunt to run Karma tests:

    grunt test    

## History

Most of the code lifted out of other projects:
    - The binary protocol was lifted from Radoslaw Gruchalski's project
    - The XMLHttpRequest and other transports extracted from the Thrift core
        - XMLHttpRequest modified to remove jquery dependency and return detailed exceptions

The echo transport is our own contribution. It is for testing.

As we began to integrate the Thrift javascript client for our service apis, it was discovered that the javascript components in both the Thrift core, as well as the most advanced binary protocol implementation, both suffered from problems. The Thrift core javascript libraries were too intertwined, and were packaged in a single library containing code that would never be used or tested.

At the moment (delete this when no longer true!) just the binary protocol, xhr transport, and echo transport are used and supported. The json protocol and websocket transports should be brought up to speed. It is unknown if the websocket implementation really works.

## License
<blockquote>
Copyright (c) 2016 The KBase Project and its Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</blockquote>