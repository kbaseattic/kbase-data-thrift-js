/*global define*/
/*jslint white:true,browser:true */
define([
], function () {
    'use strict';

    // Taken from https://mths.be/punycode
    function ucs2decode(string) {
        var output = [],
            counter = 0,
            length = string.length,
            character,
            extra;
        for (counter = 0; counter < length; counter += 1) {
            character = string.charCodeAt(counter);
            if (character >= 0xD800 && character <= 0xDBFF && counter < length) {
                // high surrogate, and there is a next character
                counter += 1;
                extra = string.charCodeAt(counter);
                if ((extra & 0xFC00) === 0xDC00) { // low surrogate
                    output.push(((character & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                } else {
                    // unmatched surrogate; only append this code unit, in case the next
                    // code unit is the high surrogate of a surrogate pair
                    output.push(character);
                    counter -= 1;
                }
            } else {
                output.push(character);
            }
        }
        return output;
    }

    // Taken from https://mths.be/punycode
    function ucs2encode(array) {
        var length = array.length,
            index = -1,
            value,
            output = '';
        while (++index < length) {
            value = array[index];
            if (value > 0xFFFF) {
                value -= 0x10000;
                output += String.fromCharCode(value >>> 10 & 0x3FF | 0xD800);
                value = 0xDC00 | value & 0x3FF;
            }
            output += String.fromCharCode(value);
        }
        return output;
    }

    function checkScalarValue(codePoint) {
        if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
            throw new Error(
                'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
                ' is not a scalar value'
                );
        }
    }
    /*--------------------------------------------------------------------------*/

    function createByte(codePoint, shift) {
        return String.fromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
    }

    function encodeCodePoint(codePoint) {
        var seq = [];
        if ((codePoint & 0xFFFFFF80) === 0) { // 1-byte sequence
            // return String.fromCharCode(codePoint);
            return [codePoint];
        }
        if ((codePoint & 0xFFFFF800) === 0) { // 2-byte sequence
            seq.push(((codePoint >> 6) & 0x1F) | 0xC0);
        } else if ((codePoint & 0xFFFF0000) === 0) { // 3-byte sequence
            checkScalarValue(codePoint);
            seq.push(((codePoint >> 12) & 0x0F) | 0xE0);
            seq.push(createByte(codePoint, 6));
        } else if ((codePoint & 0xFFE00000) === 0) { // 4-byte sequence
            seq.push(((codePoint >> 18) & 0x07) | 0xF0);
            seq.push(createByte(codePoint, 12));
            seq.push(createByte(codePoint, 6));
        }
        seq.push((codePoint & 0x3F) | 0x80);
        return seq;
    }

    function utf8encode(string) {
        var codePoints = ucs2decode(string),
            length = codePoints.length,
            index = -1,
            codePoint,
            bytes = [];
        for (index = 0; index < length; index += 1) {
        // while (++index < length) {
            codePoint = codePoints[index];
            bytes = bytes.concat(encodeCodePoint(codePoint));
        }
        var result =  new Uint8Array(bytes);
        return result;
    }

    /*--------------------------------------------------------------------------*/

    function readContinuationByte(state) {
        if (state.byteIndex >= state.byteCount) {
            throw new Error('Invalid byte index');
        }

        var continuationByte = state.byteArray[state.byteIndex] & 0xFF;
        state.byteIndex += 1;

        if ((continuationByte & 0xC0) === 0x80) {
            return continuationByte & 0x3F;
        }

        // If we end up here, it’s not a continuation byte
        throw new Error('Invalid continuation byte');
    }

    function decodeSymbol(state) {
        var byte1,
            byte2,
            byte3,
            byte4,
            codePoint;

        if (state.byteIndex > state.byteCount) {
            throw new Error('Invalid byte index');
        }

        if (state.byteIndex === state.byteCount) {
            return false;
        }

        // Read first byte
        byte1 = state.byteArray[state.byteIndex] & 0xFF;
        state.byteIndex += 1;

        // 1-byte sequence (no continuation bytes)
        if ((byte1 & 0x80) === 0) {
            return byte1;
        }

        // 2-byte sequence
        if ((byte1 & 0xE0) === 0xC0) {
            var byte2 = readContinuationByte(state);
            codePoint = ((byte1 & 0x1F) << 6) | byte2;
            if (codePoint >= 0x80) {
                return codePoint;
            }
            throw new Error('Invalid continuation byte');
        }

        // 3-byte sequence (may include unpaired surrogates)
        if ((byte1 & 0xF0) === 0xE0) {
            byte2 = readContinuationByte(state);
            byte3 = readContinuationByte(state);
            codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
            if (codePoint >= 0x0800) {
                checkScalarValue(codePoint);
                return codePoint;
            }
            throw new Error('Invalid continuation byte');
        }

        // 4-byte sequence
        if ((byte1 & 0xF8) === 0xF0) {
            byte2 = readContinuationByte(state);
            byte3 = readContinuationByte(state);
            byte4 = readContinuationByte(state);
            codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
                (byte3 << 0x06) | byte4;
            if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
                return codePoint;
            }
        }
        throw new Error('Invalid UTF-8 detected');
    }

    function utf8decode(byteArray) {
        var state = {
            byteArray: byteArray,
            byteCount: byteArray.length,
            byteIndex: 0
        },
        codePoints = [],
            tmp;
        while ((tmp = decodeSymbol(state)) !== false) {
            codePoints.push(tmp);
        }
        var result = ucs2encode(codePoints);
        return result;
    }

    /*--------------------------------------------------------------------------*/

    return Object.freeze({
        encode: utf8encode,
        decode: utf8decode
    });
});