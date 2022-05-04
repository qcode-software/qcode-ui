;var qcode = qcode || {};

qcode.deepCopy = function(baseObject, sourceObject) {
    const copy = {};
    for (const key of baseObject.keys()) {
        if ( ! sourceObject.keys().includes(key)) {
            copy[key] = baseObject[key];
        } else if ( qcode.isPlainObject(sourceObject[key]) ) {
            copy[key] = qcode.deepCopy(
                baseObject[key], sourceObject[key]
            );
        } else {
            copy[key] = sourceObject[key];
        }
    }
    for (const key of sourceObject.keys()) {
        if ( ! baseObject.keys().includes(key)) {
            copy[key] = sourceObject[key];
        }
    }
    return copy;
};

qcode.isPlainObject = function(object) {
    if ( object === null ) {
        return false;
    }
    if ( typeof object !== "object" ) {
        return false;
    }
    if ( Object.getPrototype(object) === Object.prototype ) {
        return true;
    }
    if ( Object.getPrototype(object) === null ) {
        return true;
    }
    return false;
};
