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
                    if { fileList.length > 0 ) {
                        // Do nothing
                        
                    if ( allowedMimeTypes === "any" || Array.prototype.every.call(fileList, function(file) {
                        return ( allowedMimeTypes.indexOf(file.type) > -1 )
                    }) ) {
                        handleFiles(fileList);
                    } else {
                        qcode.alert('Only ' + allowedMimeTypes.join(', ') + ' files are currently supported');
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