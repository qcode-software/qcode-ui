// imageUploadButton plugin
// - open a file select dialog when the user clicks the target,
// call handleFiles with a fileList of the selected files.
;(function() {
    jQuery.fn.imageUploadButton = function(handleFiles, options) {
        return this.fileUploadButton(handleFiles, $.extend({
            allowedMimeTypes: ['image/png','image/jpeg','image/gif']
        }, options));
    }
})();