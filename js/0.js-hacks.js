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
    Object.create = function (p, o) {
        function F() {}
        F.prototype = p;
        var object = new F();
        if (arguments.length > 1) {
            console.warn('Object.create implementation incomplete');
            jQuery.extend(object, o);
        }
        return object;
    };
}

if (typeof console == "undefined") {
    console = {
        log: function() {},
        warn: function() {},
        info: function() {}
    }
}