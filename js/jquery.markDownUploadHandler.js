/*
  markDownUploadHandler
  call on a textarea, returns a function. When the function is called with a fileList, it uploads the files,
  and generates markdown image or link depending upon the type of file in the textarea for them.
  requires an upload url, and a function to convert the xmlHttpRequest response and/or file object into an image src url.
  options = {
    uploadURL: string,
    getImageURL: function(xmlHttpRequest, file) {return string},
    postData: object (optional),
    chunkSize: string (optional, default "1MiB")
    headers: object (optional, default { 'Accept': "application/json" } )
  }
*/
$.fn.markDownUploadHandler = function(options) {
    var $textarea = this.first();
    var settings = $.extend({
	headers: {
	    'Accept': "application/json"
	}
    }, options);
	
    return function handleFiles(fileList) {
        var index = $textarea.textrange('get').selectionStart;
        $.each(fileList, function (i, file) {
            var head = $textarea.val().slice(0, index);
            var tail = $textarea.val().slice(index);
            var uploadName = file.name || guidGenerate();

            var tag = "**Uploading file " + uploadName + " [--------------------](0%)**";
            var tagPattern = new RegExp('\\*{2}Uploading file ' + uploadName + ' \\[(-|\\*)+\\]\\([0-9]+%\\)\\*{2}');
            $textarea.val(head + tag + tail);
            index = index + tag.length;
            $textarea.textrange('set', index, index);

            var uploader = new qcode.Uploader({
                file: file,
                chunkSize: settings.chunkSize,
                url: settings.uploadURL,
                postData: settings.postData,
		headers: settings.headers
            });

            $(uploader)
                    .on('progress', function(event) {
                        var perct = (event.loaded / event.total).toLocaleString("GB",{
                            minimumIntegerDigits: 2,
                            maximumFractionDigits: 0,
                            style: "percent"
                        });

			var progress_bar = '';
			for(var i=1;i<=20;i++) {
			    if(i <= Math.round((event.loaded / event.total) * 20)) {
				progress_bar = progress_bar + '*';
			    } else {
				progress_bar = progress_bar + '-';
			    }
			}
                        $textarea.textareaReplace(tagPattern, "**Uploading file " + uploadName + " [" + progress_bar + "](" + perct + ")**");
                    })
                    .on('complete', function(event, xhr) {
                        var url = settings.getImageURL(xhr, file);
                        var mime_type = jQuery.parseJSON(xhr.responseText).record.mime_type.value;
			// Alt attribute
			if ( file.name ) {
                            // Strip off the file extension to generate Alt text.
                            var alt = /^(.*)\.[^.]*$/.exec(file.name)[1];
                        } else {
                            var alt = "image";
                        }
			
			if ( jQuery.inArray(mime_type,['image/jpeg', 'image/png', 'image/gif','image/svg+xml']) > -1 ) {
			    // image
                            $textarea.textareaReplace(tagPattern, '![' + alt + '](' + url + ')');
			} 
			else {
			    // Non image file type
			    $textarea.textareaReplace(tagPattern, '[' + alt + '](' + url + ')');
			}
                    })
                    .on('error', function(event, xhr) {
                        $textarea.textareaReplace(tagPattern, '![Error uploading ' + uploadName + ']()');
                        $textarea.trigger('error', [xhr]);
                    });
            uploader.start();
        });
    };
};

