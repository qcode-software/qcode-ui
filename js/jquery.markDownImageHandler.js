/*
  markDownImageHandler
  call on a textarea, returns a function. When the function is called with a fileList, it uploads the files,
  and generates markdown image tags in the textarea for them.
  requires an upload url, and a function to convert the xmlHttpRequest response and/or file object into an image src url.
  options = {
    uploadURL: string,
    getImageURL: function(xmlHttpRequest, file) {return string},
    postData: object (optional),
    chunkSize: string (optional, default "1MiB")
    headers: object (optional, default { 'Accept': "application/json" } )
  }
*/
$.fn.markDownImageHandler = function(options) {
    var $textarea = this.first();
    var settings = $.extend({
	headers: {
	    'Accept': "application/json"
	}
    }, options);

    return function handleFiles(fileList) {
        var index = qcode.textRange.get($textarea[0]).selectionStart;
        $.each(fileList, function (i, file) {
            var head = $textarea.val().slice(0, index);
            var tail = $textarea.val().slice(index);
            var uploadName = file.name || guidGenerate();

            var tag = "![Uploading " + uploadName + " 0%]()";
            var tagPattern = new RegExp('!\\[Uploading ' + uploadName + ' [0-9]+%\\]\\(\\)');
            $textarea.val(head + tag + tail);
            index = index + tag.length;
            qcode.textRange.set($textarea[0], index, index);

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
                        $textarea.textareaReplace(tagPattern, "![Uploading " + uploadName + " " + perct + "]()");
                    })
                    .on('complete', function(event, xhr) {
                        var url = settings.getImageURL(xhr, file);
                        if ( file.name ) {
                            // Strip off the file extension to generate Alt text.
                            var alt = /^(.*)\.[^.]*$/.exec(file.name)[1];
                        } else {
                            var alt = "image";
                        }
                        $textarea.textareaReplace(tagPattern, '![' + alt + '](' + url + ')');
                    })
                    .on('error', function(event, xhr) {
                        $textarea.textareaReplace(tagPattern, '![Error uploading ' + uploadName + ']()');
                        $textarea.trigger('error', [xhr]);
                    });
            uploader.start();
        });
    };
};
