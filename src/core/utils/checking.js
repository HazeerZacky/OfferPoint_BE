/* eslint-disable no-prototype-builtins */

import _ from 'lodash';
import React from 'react';

export const PRIMITIVE_TYPES = {
    string: typeof (''),
    number: typeof (0),
    boolean: typeof (true),
    function: typeof (() => { }),
    object: typeof ({})
};

export function isTypeOf(value, type) { return typeof (value) === type; }

/**
 * Checks if value is a string.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isString(value) { return isTypeOf(value, PRIMITIVE_TYPES.string); }

/**
 * Checks if value is a boolean.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isBoolean(value) { return isTypeOf(value, PRIMITIVE_TYPES.boolean); }

/**
 * Checks if value is a number.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isNumber(value) { return !isNaN(value); }

/**
 * Checks if value is a function.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isFunction(value) { return isTypeOf(value, PRIMITIVE_TYPES.function); }

/**
 * Checks if value is a object.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isObject(value) { return isTypeOf(value, PRIMITIVE_TYPES.object); }


/**
 * Checks if value is undefined.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isUndefined(value) { return isTypeOf(value, typeof (undefined)); }

/**
 * Checks if values is undefined or null.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isUndefinedOrNull(value) { return isUndefined(value) || (value === null); }

/**
 * Checks if values is undefined, null or empty.
 * @param {any} value - value to check
 * @returns {boolean} 
 */
export function isUndefinedNullOrEmpty(value) {
    return isUndefinedOrNull(value) || (isTypeOf(value, PRIMITIVE_TYPES.object) && !(Array.isArray(value) ? value : Object.keys(value)).length) || (isString(value) && _.isEmpty(value.trim()));
}


export function isURL(textval) {
    var urlregex = new RegExp("^(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$");
    return urlregex.test(textval);
}