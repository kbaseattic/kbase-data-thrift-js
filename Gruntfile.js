    /*global require, module */
/*jslint white: true */
module.exports = function (grunt) {
    'use strict';

    // Load grunt npm tasks..
    grunt.loadNpmTasks('grunt-shell')
    grunt.loadNpmTasks('grunt-shell-spawn')
    grunt.loadNpmTasks('grunt-karma')
    // XXX: needed? grunt.loadNpmTasks('grunt-bower-requirejs')

    /////////////////////////
    // Project configuration
    /////////////////////////
    grunt.initConfig({

        // Variables.
        // These may be used in templated commands that follow.
        specsTestDir: 'test/thrift/specs',
        jsTestDir: 'src/js/test',
        pyTestDir: 'src/python/kbtest',
        pyVerbose: '-v',
        nodeBinDir: 'node_modules/.bin',

        // Shell commands
        shell: {
            compileThriftJavascript: {
                command: ['mkdir -p <%= jsTestDir %>',
                         'thrift --gen js:jquery -out <%= jsTestDir %>/basic ' +
                         '<%= specsTestDir %>/basic.thrift'].join(' && '),
                options: {stderr: false}
            },
            compileThriftPython: {
                command: ['mkdir -p <%= pyTestDir %>',
                         'thrift --gen py:new -out <%= pyTestDir %> ' +
                         '<%= specsTestDir %>/basic.thrift'].join(' && '),
                options: {stderr: false}
            },
            installPython: {
                command: 'python setup.py install',
                options: {
                    stderr: false, stdout: false,
                    execOptions: {cwd: 'src/python'}
                }
            },
            modifyThriftStubs: {
                command: 'add_requirejs.py <%= pyVerbose %> ' +
                         '<%= jsTestDir %>/basic',
            },
            // Run the local Thrift server for the "basic" spec.
            basicThriftServer: {
                command: 'run_basic.py <%= pyVerbose %> ' +
                         '-c <%= nodeBinDir %>/corsproxy -p 8000',
                options : {
                    async: true,
                    stderr: true,
                    stdout: true
                }
            },
            // Run the Python nosetests -- sort of a preflight check
            pythonNoseTests: {
                command: 'nosetests -w src/python',
                options: {stdout: true, stderr: true}
            }
        },

        // Karma test configuration
        karma: {
          unit: {
            configFile: 'test/karma.conf.js',
            // Turn off colored output (easier to grep this way)
           colors: false
          }
        }
    });

    ////////////////////////////
    // Register tasks         //
    ////////////////////////////

    // Wait for given number of milliseconds
    grunt.registerTask('wait', 'Wait for a set amount of time.',
        function(delay_ms) {
            grunt.log.write('Waiting ' + delay_ms + 'ms');
            setTimeout(this.async(), delay_ms);
        }
    );

    // Task: install
    // Installs local Python libraries and scripts
    grunt.registerTask('install', [
        'shell:installPython'
    ]);

    // Task: thrift
    // Compiles stubs using thrift
    grunt.registerTask('thrift', [
        'install',
        'shell:compileThriftJavascript',
        'shell:compileThriftPython',
        'shell:modifyThriftStubs'
    ]);

    // Task: test
    // Run the Karma tests
    grunt.registerTask('test', [
        'shell:basicThriftServer',       // start server in background
        'wait:2000',                     // sleep 2
        'shell:pythonNoseTests',         // pre-tests in Python
        'karma',                         // run all the tests
        'shell:basicThriftServer:kill'   // kill the server
    ]);

    // Task: default
    grunt.registerTask('default', ['thrift'])
    // build == default
    grunt.registerTask('build', ['thrift'])


};
