/**
 * @module Basic
 * @author Erik Pearson
 * @version 0.1.0
 * @param {AssemblyLibrary} assembly
 * @param {TriftLibrary} Thrift
 * @param {BluebirdPromise} Promise
 * @returns {Assembly_L12.factory}
 */
/*global define*/
/*jslint white: true, browser: true*/
define([
    'bluebird',
    'kb_basic_service',
    'thrift',

    // These don't have representations. Loading them causes the Thrift module
    // to be enhanced with additional properties (typically just a single
    //  property, the new capability added.)
    'thrift_xhr_transport',
    'thrift_binary_protocol'
], function (Promise, ThriftService, Thrift) {
    'use strict';

    return function (url) {
        var timeout = 30000;

        function client() {
            //console.log('@@ create_basic_client/start')
             try {
                var transport = new Thrift.TXHRTransport(url, {timeout:
                timeout});
                var protocol = new Thrift.TBinaryProtocol(transport);
                var thriftClient = new ThriftService.thrift_serviceClient(protocol);
                //console.log('@@ create_basic_client/end')
                return thriftClient;
            } catch (ex) {
                //console.error('create_basic_client:end ERROR')
                // Rethrow exceptions in our format:
                if (ex.type && ex.name) {
                    throw ex;
                } else {
                    //console.log(new Error().stack);
                    throw {
                        type: 'ThriftError',
                        message: 'An error was encountered creating the thrift client objects',
                        suggestion: 'This could be a configuration or runtime error. Please consult the console for the error object',
                        errorObject: ex
                    };
                }
            }
            console.log('create_basic_client/end')
        }

        // Define public methods

        var _exports = {
            get_a_map: function(keys) {
                return Promise.resolve(client().get_a_map(keys, true))
            },
            add_integers: function(x, y) {
                return Promise.resolve(client().add_integers(x, y, true))
            }
        };

        // Return public methods

        return Object.freeze(_exports);

    };
});
