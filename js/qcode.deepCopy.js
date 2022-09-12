;var qcode = qcode || {};

qcode.deepCopy = function(baseObject, sourceObject, ...additionalObjects) {
    let copy = {};
    for (const key of Object.keys(baseObject)) {
        if ( ! Object.keys(sourceObject).includes(key)) {
            if ( qcode.isPlainObject(baseObject[key]) ) {
                copy[key] = qcode.deepCopy({}, baseObject[key]);
            } else {
                copy[key] = baseObject[key];
            }
            
        } else if ( qcode.isPlainObject(sourceObject[key]) ) {
            if ( qcode.isPlainObject(baseObject[key]) ) {
                copy[key] = qcode.deepCopy(
                    baseObject[key], sourceObject[key]
                );
            } else {
                copy[key] = qcode.deepCopy(
                    {}, sourceObject[key]
                );
            }
            
        } else {
            copy[key] = sourceObject[key];
        }
    }
    for (const key of Object.keys(sourceObject)) {
        if ( ! Object.keys(baseObject).includes(key)) {
            copy[key] = sourceObject[key];
        }
    }
    for (const additionalObject of additionalObjects) {
        copy = qcode.deepCopy(copy, additionalObject);
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
    if ( Object.getPrototypeOf(object) === Object.prototype ) {
        return true;
    }
    if ( Object.getPrototypeOf(object) === null ) {
        return true;
    }
    return false;
};
