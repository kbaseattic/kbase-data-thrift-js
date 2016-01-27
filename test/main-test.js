var tests = [];
for (var file in window.__karma__.files) {
  //console.log('looking at file: ' + file)
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}
//console.log('All tests:', tests);

var libpath = 'src/js/lib/';
var testpath = 'src/js/test/';
var bowerpath = 'bower_components/';

requirejs.config({
    // Karma serves files from '/base', which is the root directory
    baseUrl: '/base',

    paths: {
        thrift: libpath + 'thrift-core',
        thrift_echo_transport: libpath + 'thrift-transport-echo',
        thrift_xhr_transport: libpath + 'thrift-transport-xhr',
        thrift_binary_protocol: libpath + 'thrift-protocol-binary',
        kb_basic_types: testpath + 'basic/basic_types',
        kb_basic_service: testpath + 'basic/thrift_service',
        kb_basic: testpath + 'basic/basic',
        bluebird: bowerpath + 'bluebird/js/browser/bluebird'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    },
    map: {
        '*': {
            'css': 'css',
            'promise': 'bluebird'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});