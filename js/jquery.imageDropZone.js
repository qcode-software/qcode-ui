// imageDropZone plugin
// when image files are dropped onto the target element,
// call handleFiles with a fileList of the dropped files.
;(function() {
    jQuery.fn.imageDropZone = function(handleFiles, options) {
        return this.fileDropZone(handleFiles, $.extend({
            allowedMimeTypes: ['image/png','image/jpeg','image/gif']
        }, options));
    }
})();