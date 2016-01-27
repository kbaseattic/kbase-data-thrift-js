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

define([
    'thrift'
], function (Thrift) {
    'use strict';

    Thrift.EchoTransport = function (options) {
        this.buffer = [];
        this.readPos = 0;
    };

    Thrift.EchoTransport.prototype = {
        flush: function (async, callback) {
            // does nothing.
        },
        
        /**
         * Returns true if the transport is open, XHR always returns true.
         * @readonly
         * @returns {boolean} Always True.
         */
        isOpen: function () {
            return true;
        },
        /**
         * Opens the transport connection, with XHR this is a nop.
         */
        open: function () {
            this.buffer = [];
            this.readPos = 0;
        },
        /**
         * Closes the transport connection, with XHR this is a nop.
         */
        close: function () {},
        /**
         * Returns the specified number of characters from the response
         * buffer.
         * @param {number} len - The number of characters to return.
         * @returns {string} Characters sent by the server.
         */
        readByte: function () {
            var avail = this.buffer.length - this.readPos;
            if (avail === 0) {
                return null;
            }

            var ret = this.buffer[this.readPos];
            this.readPos += 1;

            return ret;
        },
        read: function (len) {
             var avail = this.buffer.length - this.readPos;

            if (avail === 0) {
                throw new Error('End of buffer');
            }

            // var give = len;

            if (avail < len) {
                throw new Error('Requested more bytes (' + len + ') than are available (' + avail + ')');
                // give = avail;
            }

            this.readPos += len;
            return this.buffer.slice(this.readPos - len, this.readPos);
        },
        /**
         * Returns the entire response buffer.
         * @returns {string} Characters sent by the server.
         */
        readAll: function () {
            return this.buffer;
        },
        /**
         * Sets the send buffer to buf.
         * @param {string} buf - The buffer to send.
         */
        writeByte: function (b) {
            this.buffer.push(b);
            this.bufferLength += 1
        },
        write: function (buf) {
            this.buffer = this.buffer.concat(buf);
        }
    };
    
    return Thrift;
});








