// imageUploadButton plugin
// - open a file select dialog when the user clicks the target,
// call handleFiles with a fileList of the selected files.
(function() {
    var allowedMimeTypes = ['image/png','image/jpeg','image/gif'];
    var hiddenInput;
    jQuery.fn.imageUploadButton = function(handleFiles) {
        $(this).on('click',function() {
            if ( hiddenInput === undefined ) {
                hiddenInput = $('<input>').attr({
                    type: "file",
                    multiple: true,
                    accept: allowedMimeTypes.join(',')
                }).appendTo('body').hide();
                hiddenInput.on('change', function(event) {
                    var fileList = this.files;
                    if ( Array.prototype.every.call(fileList, function(file) {
                        return ( allowedMimeTypes.indexOf(file.type) > -1 )
                    }) ) {
                        handleFiles(fileList);
                    } else {
                        qcode.alert('Only png, jpg, and gif files are currently supported');
                    }
                });
            }
            hiddenInput.click();
        });
    }
})();