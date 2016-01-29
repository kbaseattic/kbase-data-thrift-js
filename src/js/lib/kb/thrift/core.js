/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*global define */
/*jshint white: true */

/**
 * The Thrift namespace houses the Apache Thrift JavaScript library 
 * elements providing JavaScript bindings for the Apache Thrift RPC 
 * system. End users will typically only directly make use of the 
 * Transport (TXHRTransport/TWebSocketTransport) and Protocol 
 * (TJSONPRotocol/TBinaryProtocol) constructors.
 * 
 * Object methods beginning with a __ (e.g. __onOpen()) are internal 
 * and should not be called outside of the object's own methods.
 * 
 * This library creates one global object: Thrift
 * Code in this library must never create additional global identifiers,
 * all features must be scoped within the Thrift namespace.
 * @namespace
 * @example
 *     var transport = new Thrift.Transport("http://localhost:8585");
 *     var protocol  = new Thrift.Protocol(transport);
 *     var client = new MyThriftSvcClient(protocol);
 *     var result = client.MyMethod();
 */
define([], function () {
    'use strict';
    var Thrift = {
        /**
         * Thrift JavaScript library version.
         * @readonly
         * @const {string} Version
         * @memberof Thrift
         */
        Version: '1.0.0-dev',
        /**
         * Thrift IDL type string to Id mapping.
         * @readonly
         * @property {number}  STOP   - End of a set of fields.
         * @property {number}  VOID   - No value (only legal for return types).
         * @property {number}  BOOL   - True/False integer.
         * @property {number}  BYTE   - Signed 8 bit integer.
         * @property {number}  I08    - Signed 8 bit integer.     
         * @property {number}  DOUBLE - 64 bit IEEE 854 floating point.
         * @property {number}  I16    - Signed 16 bit integer.
         * @property {number}  I32    - Signed 32 bit integer.
         * @property {number}  I64    - Signed 64 bit integer.
         * @property {number}  STRING - Array of bytes representing a string of characters.
         * @property {number}  UTF7   - Array of bytes representing a string of UTF7 encoded characters.
         * @property {number}  STRUCT - A multifield type.
         * @property {number}  MAP    - A collection type (map/associative-array/dictionary).
         * @property {number}  SET    - A collection type (unordered and without repeated values).
         * @property {number}  LIST   - A collection type (unordered).
         * @property {number}  UTF8   - Array of bytes representing a string of UTF8 encoded characters.
         * @property {number}  UTF16  - Array of bytes representing a string of UTF16 encoded characters.
         */
        Type: {
            'STOP': 0,
            'VOID': 1,
            'BOOL': 2,
            'BYTE': 3,
            'I08': 3,
            'DOUBLE': 4,
            'I16': 6,
            'I32': 8,
            'I64': 10,
            'STRING': 11,
            'UTF7': 11,
            'STRUCT': 12,
            'MAP': 13,
            'SET': 14,
            'LIST': 15,
            'UTF8': 16,
            'UTF16': 17
        },
        /**
         * Thrift RPC message type string to Id mapping.
         * @readonly
         * @property {number}  CALL      - RPC call sent from client to server.
         * @property {number}  REPLY     - RPC call normal response from server to client.
         * @property {number}  EXCEPTION - RPC call exception response from server to client.
         * @property {number}  ONEWAY    - Oneway RPC call from client to server with no response.
         */
        MessageType: {
            'CALL': 1,
            'REPLY': 2,
            'EXCEPTION': 3,
            'ONEWAY': 4
        },
        /**
         * Utility function returning the count of an object's own properties.
         * @param {object} obj - Object to test.
         * @returns {number} number of object's own properties
         */
        objectLength: function (obj) {
            var length = 0, k;
            Object.keys(obj).forEach(function (k) {
                length += 1;
            });
            return length;
        },
        /**
         * Utility function to establish prototype inheritance.
         * @see {@link http://javascript.crockford.com/prototypal.html|Prototypal Inheritance}
         * @param {function} constructor - Contstructor function to set as derived.
         * @param {function} superConstructor - Contstructor function to set as base.
         * @param {string} [name] - Type name to set as name property in derived prototype.
         */
        inherits: function (constructor, superConstructor, name) {
            function F() {}
            F.prototype = superConstructor.prototype;
            constructor.prototype = new F();
            constructor.prototype.name = name || "";
        }
    };

    /**
     * Initializes a Thrift TException instance.
     * @constructor
     * @augments Error
     * @param {string} message - The TException message (distinct from the Error message).
     * @classdesc TException is the base class for all Thrift exceptions types.
     */
    Thrift.TException = function (message) {
        this.message = message;
    };
    Thrift.inherits(Thrift.TException, Error, 'TException');

    /**
     * Returns the message set on the exception.
     * @readonly
     * @returns {string} exception message
     */
    Thrift.TException.prototype.getMessage = function () {
        return this.message;
    };

    /**
     * Thrift Application Exception type string to Id mapping.
     * @readonly
     * @property {number}  UNKNOWN                 - Unknown/undefined.
     * @property {number}  UNKNOWN_METHOD          - Client attempted to call a method unknown to the server.
     * @property {number}  INVALID_MESSAGE_TYPE    - Client passed an unknown/unsupported MessageType.
     * @property {number}  WRONG_METHOD_NAME       - Unused.
     * @property {number}  BAD_SEQUENCE_ID         - Unused in Thrift RPC, used to flag proprietary sequence number errors.
     * @property {number}  MISSING_RESULT          - Raised by a server processor if a handler fails to supply the required return result.
     * @property {number}  INTERNAL_ERROR          - Something bad happened.
     * @property {number}  PROTOCOL_ERROR          - The protocol layer failed to serialize or deserialize data.
     * @property {number}  INVALID_TRANSFORM       - Unused.
     * @property {number}  INVALID_PROTOCOL        - The protocol (or version) is not supported.
     * @property {number}  UNSUPPORTED_CLIENT_TYPE - Unused.
     */
    Thrift.TApplicationExceptionType = {
        'UNKNOWN': 0,
        'UNKNOWN_METHOD': 1,
        'INVALID_MESSAGE_TYPE': 2,
        'WRONG_METHOD_NAME': 3,
        'BAD_SEQUENCE_ID': 4,
        'MISSING_RESULT': 5,
        'INTERNAL_ERROR': 6,
        'PROTOCOL_ERROR': 7,
        'INVALID_TRANSFORM': 8,
        'INVALID_PROTOCOL': 9,
        'UNSUPPORTED_CLIENT_TYPE': 10
    };

    /**
     * Initializes a Thrift TApplicationException instance.
     * @constructor
     * @augments Thrift.TException
     * @param {string} message - The TApplicationException message (distinct from the Error message).
     * @param {Thrift.TApplicationExceptionType} [code] - The TApplicationExceptionType code.
     * @classdesc TApplicationException is the exception class used to propagate exceptions from an RPC server back to a calling client.
     */
    Thrift.TApplicationException = function (message, code) {
        this.message = message;
        this.code = typeof code === "number" ? code : 0;
    };
    Thrift.inherits(Thrift.TApplicationException, Thrift.TException, 'TApplicationException');

    /**
     * Read a TApplicationException from the supplied protocol.
     * @param {object} input - The input protocol to read from.
     */
    Thrift.TApplicationException.prototype.read = function (input) {
        while (1) {
            var ret = input.readFieldBegin();

            if (ret.ftype === Thrift.Type.STOP) {
                break;
            }

            var fid = ret.fid;

            switch (fid) {
                case 1:
                    if (ret.ftype === Thrift.Type.STRING) {
                        ret = input.readString();
                        this.message = ret.value;
                    } else {
                        ret = input.skip(ret.ftype);
                    }
                    break;
                case 2:
                    if (ret.ftype === Thrift.Type.I32) {
                        ret = input.readI32();
                        this.code = ret.value;
                    } else {
                        ret = input.skip(ret.ftype);
                    }
                    break;
                default:
                    ret = input.skip(ret.ftype);
                    break;
            }

            input.readFieldEnd();
        }

        input.readStructEnd();
    };

    /**
     * Wite a TApplicationException to the supplied protocol.
     * @param {object} output - The output protocol to write to.
     */
    Thrift.TApplicationException.prototype.write = function (output) {
        output.writeStructBegin('TApplicationException');

        if (this.message) {
            output.writeFieldBegin('message', Thrift.Type.STRING, 1);
            output.writeString(this.getMessage());
            output.writeFieldEnd();
        }

        if (this.code) {
            output.writeFieldBegin('type', Thrift.Type.I32, 2);
            output.writeI32(this.code);
            output.writeFieldEnd();
        }

        output.writeFieldStop();
        output.writeStructEnd();
    };

    /**
     * Returns the application exception code set on the exception.
     * @readonly
     * @returns {Thrift.TApplicationExceptionType} exception code
     */
    Thrift.TApplicationException.prototype.getCode = function () {
        return this.code;
    };

    var copyList, copyMap;

    copyList = function (lst, types) {

        if (!lst) {
            return lst;
        }

        var type;

        if (types.shift === undefined) {
            type = types;
        } else {
            type = types[0];
        }
        var Type = type;

        var len = lst.length, result = [], i, val;
        for (i = 0; i < len; i++) {
            val = lst[i];
            if (type === null) {
                result.push(val);
            } else if (type === copyMap || type === copyList) {
                result.push(type(val, types.slice(1)));
            } else {
                result.push(new Type(val));
            }
        }
        return result;
    };

    copyMap = function (obj, types) {

        if (!obj) {
            return obj;
        }

        var type;

        if (types.shift === undefined) {
            type = types;
        } else {
            type = types[0];
        }
        var Type = type;

        var result = {}, val;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                val = obj[prop];
                if (type === null) {
                    result[prop] = val;
                } else if (type === copyMap || type === copyList) {
                    result[prop] = type(val, types.slice(1));
                } else {
                    result[prop] = new Type(val);
                }
            }
        }
        return result;
    };

    Thrift.copyMap = copyMap;
    Thrift.copyList = copyList;

   

    return Thrift;
});