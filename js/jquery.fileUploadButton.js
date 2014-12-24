// fileUploadButton plugin
// - open a file select dialog when the user clicks the target,
// call handleFiles with a fileList of the selected files.
;(function() {
    jQuery.fn.fileUploadButton = function(handleFiles, options) {
        var hiddenInput;
        var options = options || {};
        var allowedMimeTypes = options.allowedMimeTypes || "all";
        this.on('click',function() {
            if ( hiddenInput === undefined ) {
                hiddenInput = $('<input>').attr({
                    type: "file",
                    multiple: true
                }).appendTo('body').hide();
                if ( allowedMimeTypes !== "all" ) {
                    hiddenInput.attr('accept', allowedMimeTypes.join(','));
                }
                hiddenInput.on('change', function(event) {
                    var fileList = this.files;
                    if ( allowedMimeTypes === "all" || Array.prototype.every.call(fileList, function(file) {
                        return ( allowedMimeTypes.indexOf(file.type) > -1 )
                    }) ) {
                        handleFiles(fileList);
                    } else {
                        qcode.alert('Only ' + allowedMimeTypes.join(', ') + ' files are currently supported');
                    }
                });
            }
            hiddenInput.click();
        });
        return this;
    }
})();