;(function($) {
    if ( $.isFunction($.widget) ) {
	var slice = Array.prototype.slice;

	$.widget.bridge = function( name, object ) {
	    var fullName = object.prototype.widgetFullName || name;
	    $.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
		args = slice.call( arguments, 1 ),
		returnValue = this;
		
		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
		    $.widget.extend.apply( null, [ options ].concat(args) ) :
		    options;

		if ( isMethodCall ) {
		    this.each(function() {
			var methodValue,
			instance = $.data( this, fullName );
			if ( !instance ) {
                            // Create widget with default when method is called before init.
			    $.data( this, fullName, new object( undefined, this ) );
			    instance = $.data( this, fullName );
			}
			if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
			    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
			}
			methodValue = instance[ options ].apply( instance, args );
			if ( methodValue !== instance && methodValue !== undefined ) {
			    returnValue = methodValue && methodValue.jquery ?
				returnValue.pushStack( methodValue.get() ) :
				methodValue;
			    return false;
			}
		    });
		} else {
		    this.each(function() {
			var instance = $.data( this, fullName );
			if ( instance ) {
			    instance.option( options || {} )._init();
			} else {
			    $.data( this, fullName, new object( options, this ) );
			}
		    });
		}

		return returnValue;
	    };
	}
    }
}) (jQuery);
