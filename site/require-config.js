'use strict';
require.config({
    baseUrl: '/',
    catchError: true,
    onError: function (err) {
        alert("RequireJS Error:" + err);
    },
    paths: {
        thrift: 'src/thrift-core',
        thrift_echo_transport: 'src/thrift-transport-echo',
        thrift_xhr_transport: 'src/thrift-transport-xhr',
        thrift_binary_protocol: 'src/thrift-protocol-binary',
    },
    shim: {
    },
    map: {
    }
});

