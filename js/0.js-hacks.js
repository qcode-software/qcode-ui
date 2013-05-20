// Support for Function.prototype.bound in earlier browsers - taken from developer.mozilla.org
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
	if (typeof this !== "function") {
	    // closest thing possible to the ECMAScript 5 internal IsCallable function
	    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	}
	
	var aArgs = Array.prototype.slice.call(arguments, 1), 
	fToBind = this, 
	fNOP = function () {},
	fBound = function () {
	    // If the bound function is called with the "new" keyword, the scope will be the new object instead of oThis
	    return fToBind.apply(this instanceof fNOP && oThis
				 ? this
				 : oThis,
				 aArgs.concat(Array.prototype.slice.call(arguments)));
	};
	
	// The bound function prototype inherits from the original function prototype
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	
	return fBound;
    };
}

// Support for Object.create in earlier browsers
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Support for String.startsWith in earlier browsers
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
             return this.indexOf(searchString, position) === position;
        }
    });
}