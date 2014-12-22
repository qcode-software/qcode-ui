// imageDropZone plugin
// when image files are dropped onto the target element,
// call handleFiles with a fileList of the dropped files.
(function() {
    jQuery.fn.imageDropZone = function(handleFiles, options) {
        var options = options || {};
        var allowedMimeTypes = options.allowedMimeTypes || ['image/png','image/jpeg','image/gif'];
        this
                .on('dragenter dragover', function(event) {
                    $(this).addClass('drag-hover');
                    event.preventDefault();
                    event.originalEvent.dataTransfer.dropEffect = "copy";
                })
                .on('drop', function(event) {
                    event.preventDefault();
                    var fileList = event.originalEvent.dataTransfer.files;
                    if ( Array.prototype.every.call(fileList, function(file) {
                        return ( allowedMimeTypes.indexOf(file.type) > -1 )
                    }) ) {
                        handleFiles(fileList);
                    } else {
                        qcode.alert('Only ' + allowedMimeTypes.join(', ') + ' files are currently supported');
                    }
                })
                .on('dragleave drop', function() {
                    if ( $(event.target).is(this) ) {
                        $(this).removeClass('drag-hover');
                    }
                });
        return this;
    }
})();