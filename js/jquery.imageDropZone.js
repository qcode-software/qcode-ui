// imageDropZone plugin
// when image files are dropped onto the target element,
// call handleFiles with a fileList of the dropped files.
(function() {
    var allowedMimeTypes = ['image/png','image/jpeg','image/gif'];
    jQuery.fn.imageDropZone = function(handleFiles) {
        $(this)
                .on('dragenter dragover', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on('drop', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var fileList = event.originalEvent.dataTransfer.files;
                    if ( Array.prototype.every.call(fileList, function(file) {
                        return ( allowedMimeTypes.indexOf(file.type) > -1 )
                    }) ) {
                        handleFiles(fileList);
                    } else {
                        qcode.alert('Only png, jpg, and gif files are currently supported');
                    }
                });
    }
})();