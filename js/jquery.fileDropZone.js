// fileDropZone plugin
// When files are dropped onto the target element,
// call handleFiles with a fileList of the dropped files.
;(function() {
    jQuery.fn.fileDropZone = function(handleFiles, options) {
        var options = options || {};
        var allowedMimeTypes = options.allowedMimeTypes || "any";
        this
                .on('dragenter dragover', function(event) {
                    $(this).addClass('drag-hover');
                    event.preventDefault();
                    event.originalEvent.dataTransfer.dropEffect = "copy";
                })
                .on('drop', function(event) {
                    event.preventDefault();
                    var fileList = event.originalEvent.dataTransfer.files;
                    
                    if ( fileList.length == 0 ) {
                        // No files dropped, do nothing
                        return
                    }

                    function fileAllowed(file) {
                        // Return true iff file is in list of allowed types
                        return ( allowedMimeTypes.indexOf(file.type) > -1 );
                    }
                    
                    if ( allowedMimeTypes === "any"
                         ||
                         Array.prototype.every.call(fileList, fileAllowed)
                       ) {
                        // Every file is of an allowed type
                        handleFiles(fileList);
                    } else {
                        // Some files are not of allowed type
                        qcode.alert('Only '
                                    + allowedMimeTypes.join(', ')
                                    + ' files are currently supported');
                    }
                })
                .on('dragleave drop', function(event) {
                    if ( $(event.target).is(this) ) {
                        $(this).removeClass('drag-hover');
                    }
                });
        return this;
    }
})();
