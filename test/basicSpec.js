/*global
 define, describe, expect, it
 */
/*jslint
 browser: true,
 white: true
 */
 // Basic end-to-end test
define(['kb_basic'], 
    function (BasicService) {
        'use strict';

        var url = 'http://localhost:8000/localhost:9100'

        describe('Basic test', function () {

            //console.log('@@ Contacting service at: "' + url + '"')

            // Standard constructor
            var svc = BasicService(url)

            // Tests

            it('add two integers', function(done) {
                var result = svc.add_integers(2, 2);
                result.then(function (value) {
                    expect(value).toBe(4)
                    done()
                },
                function(reason) {
                    console.error('Failed: ' + reason)
                    expect(false).toBe(true)
                    done()
                })
                return null;
            }, 2000);

            it('get map', function(done) {
                var expected = {a: 1.0, b: 2.0, c: 3.0}
                svc.get_a_map(Object.keys(expected)).then(function(result) {
                    expect(result['b']).toBeCloseTo(expected['b'], 6)
                    done();
                })
                return null;
            }, 10000);

            it('')
        })
    }
)

