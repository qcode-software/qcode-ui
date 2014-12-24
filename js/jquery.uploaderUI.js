// jquery.uploaderUI plugin
// A dropzone and upload button, with panels to indicate upload status
// options {
//   validation: (optional) function(fileList) {return accepted FileList or promise thereof for upload}
//   uploadURL: json url to upload to
//   uploadData: (optional) object-map of additional POST data, sent to upload url
//   onUpload: (optional) function(responseObject) {called on upload completion, with response from server}
// }
;(function() {
    "use strict";
    jQuery.fn.uploaderUI = function(options) {
        if ( typeof options.validation === 'undefined' ) {
            var validation = function(files) {
                return files;
            }
        } else {
            var validation = options.validation;
        }

        var $dropzone = this.find('.dropzone');
        $dropzone.fileDropZone(uploadHandler, {allowedMimeTypes: options.allowedMimeTypes});
        this.find('.upload-button').fileUploadButton(uploadHandler, {allowedMimeTypes: options.allowedMimeTypes});
        
        function uploadHandler(files) {
            $.when(validation(files))
                    .done(function(okFiles) {
                        $.each(okFiles, function(i, file) {
                            var fileUpload = beginUpload(file, $dropzone, options.uploadURL, options.uploadData);
                            if ( typeof options.onUpload === 'function' ) {
                                fileUpload.done(options.onUpload);
                            }
                        });
                    })
                    .fail(function() {
                        qcode.alert('Server Error - A report has been sent to our engineers');
                    });
        }

        return this; //jQuery plugin chaining
    }

    function beginUpload(file, $dropzone, uploadURL, uploadData) {
        // Upload a file, create a panel to display progress,
        // return a promise of the server response object for the completed upload
        var deferred = new jQuery.Deferred();
        var percentSpan = $('<span>').addClass('percent').text("0%");
        var filenameSpan = $('<span>').addClass('filename').text(file.name);
        var progressPanel = $('<div>').append(filenameSpan).append(percentSpan).addClass('panel uploading');
        $dropzone.append(progressPanel);
        var uploader = new qcode.Uploader({
            file: file,
            chunkSize: '1MiB',
            url: uploadURL,
            postData: uploadData
        });
        $(uploader)
                .on('progress', function(event) {
                    var perct = (event.loaded / event.total).toLocaleString(
                        "GB", { maximumFractionDigits: 0, style: "percent" }
                    );
                    percentSpan.text(perct);
                })
                .on('complete', function(event, xhr) {
                    percentSpan.text('Complete');
                    progressPanel.removeClass('uploading').addClass('complete');
                    var response = jQuery.parseJSON(xhr.responseText);
                    deferred.resolve(response);
                })
                .on('error', function(event, xhr) {
                    percentSpan.text('Error');
                    progressPanel.removeClass('uploading').addClass('error');
                });
        uploader.start();
        return deferred.promise();
    }
})();