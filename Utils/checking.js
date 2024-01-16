
const PRIMITIVE_TYPES = {
    string: typeof (''),
    number: typeof (0),
    boolean: typeof (true),
    function: typeof (() => { }),
    object: typeof ({})
};

function isTypeOf(value, type) { return typeof (value) === type; }

function isNumber(value) { return !isNaN(value); }

function isObject(value) { return isTypeOf(value, PRIMITIVE_TYPES.object); }

function isUndefined(value) { return isTypeOf(value, typeof (undefined)); }

function isObjectHasKey(obj, key) { 
    return isObject(obj) && key in obj;
}

module.exports={isNumber, isObject, isUndefined, isObjectHasKey}
