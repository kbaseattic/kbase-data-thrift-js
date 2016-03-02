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
        testDir: 'test',

        // Karma test configuration
        karma: {
          unit: {
            configFile: '<%= testDir %>/karma.conf.js',
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

    // Task: test
    // Run the Karma tests
    grunt.registerTask('test', [
        'karma'                         // run all the tests
    ]);

    // Task: default
    grunt.registerTask('default', ['test'])
    // build == default
    grunt.registerTask('build', ['test'])


};
