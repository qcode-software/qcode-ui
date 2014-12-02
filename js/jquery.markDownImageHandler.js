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
  }
*/
$.fn.markDownImageHandler = function(options) {
    var $textarea = this.first();

    return function handleFiles(fileList) {
        var index = $textarea.textrange('get').selectionStart;
        $.each(fileList, function (i, file) {
            var head = $textarea.val().slice(0, index);
            var tail = $textarea.val().slice(index);
            var uploadName = file.name || guidGenerate();

            var tag = "![Uploading " + uploadName + " 0%]()";
            var tagPattern = new RegExp('!\\[Uploading ' + uploadName + ' [0-9]+%\\]\\(\\)');
            $textarea.val(head + tag + tail);
            index = index + tag.length;
            $textarea.textrange('set', index, index);

            var uploader = new qcode.Uploader({
                file: file,
                chunkSize: options.chunkSize,
                url: options.uploadURL,
                postData: options.postData
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
                        var url = options.getImageURL(xhr, file);
                        if ( file.name ) {
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

/* textareaReplace plugin
   performs a regexp-replace on the contents of a textarea, while preserving the caret/selection.
*/
$.fn.textareaReplace = function(regexp, replacement) {
    textarea = this;
    var oldValue = textarea.val();
    var selection = textarea.textrange('get');
    var start = selection.selectionStart;
    var end = selection.selectionEnd;
    var match = oldValue.match(regexp);
    if ( match ) {
        var diff = replacement.length - match[0].length;
        if ( start > match.index ) {
            start += diff;
        }
        if ( end > match.index ) {
            end += diff;
        }
        var newValue = oldValue.slice(0,match.index) + replacement + oldValue.slice(match.index + match[0].length);
        textarea.val(newValue);
        textarea.textrange('set',start,end);
    }
    return this;
}