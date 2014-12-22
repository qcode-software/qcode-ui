// qcode.FilenameCollisionChecker - takes an url and any additional post data, returns a "checker" function
// checker function - takes an array of files, returns a promise of an array of accepted files
// Uses the url, the filename, and any additional data to test for filename collision and ask the user to confirm.
;var qcode = qcode || {};
(function() {
    "use strict";
    qcode.FilenameCollisionChecker = function(url, additionalData) {
        return function checkFiles(files) {
            // Check files for name collisions (asynchronous), then upload
            var deferred = new jQuery.Deferred();

            jQuery.when(files).done(function(files) {
                var checks = [];
                $.each(files,function(i, file) {
                    checks.push(checkFile(file, url, additionalData));
                });
                var fileChecks = jQuery.when.apply(jQuery, checks);
                fileChecks
                        .done(function() {
                            var fileQueue = [];
                            for ( var i = 0; i < arguments.length; i++ ) {
                                if ( arguments[i] !== null ) {
                                    fileQueue.push(arguments[i]);
                                }
                            }
                            deferred.resolve(fileQueue);
                        })
                        .fail(function() {
                            deferred.reject();
                        });
            });

            return deferred.promise();
        }
    }

    function checkFile(file, url, additionalData) {
        // Check a file for namespace collision (asynchronous)
        // Return a promise that resolves with the file if it is accepted, with null otherwise
        var deferred = new jQuery.Deferred();
	jQuery.ajax({
            url: url,
	    async: false,
	    cache: false,
	    data: $.extend({
		filename: file.name
	    },additionalData),
	    dataType: "json"
	}).done(function(data) {
	    if ( data.result !== true ) {
                deferred.resolve(file);
            } else {
                qcode.confirm(
                    'File "' + file.name + '" already exists. Do you want to replace it?',
                    function() {deferred.resolve(file);},
                    function() {deferred.resolve(null);}
                );
            }
	}).fail(function(jqXHR, textStatus, errorThrown) {
            deferred.reject()
        });
        return deferred.promise();
    }
})();