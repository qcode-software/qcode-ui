/*
  options = {
    uploadURL: string,
    getImageURL: function(xhr, file) {},
    postData: object (optional),
    chunkSize: string (optional, default "1MiB")
  }
*/
$.fn.markDownImageHandler = function(options) {
    $(this).each(function(t, target) {
        var $textarea = $(target);

        $textarea.imageDropZone(handleFiles);

        $textarea.on('paste', function (event) {
            for (var i = event.originalEvent.clipboardData.items.length - 1; i >= 0; i--) {
                var item = event.originalEvent.clipboardData.items[i];
                if (item.kind === "file") {
                    var file = item.getAsFile();
                    switch (item.type) {
                    case "image/png":
                        var ext = ".png";
                        break;
                    case "image/jpeg":
                        var ext = ".jpeg";
                        break;
                    case "image/gif":
                        var ext = ".gif";
                        break;
                    default:
                        var ext = '';
                    }
                    file.name = guidGenerate() + ext;
                    handleFiles([file]);
                }
            };
        });

        function handleFiles(fileList) {
            var index = $textarea.textrange('get').selectionStart;
            $.each(fileList, function (i, file) {
                var head = $textarea.val().slice(0, index);
                var tail = $textarea.val().slice(index);

                var tag = "![Uploading " + file.name + " 0%]()";
                var tagPattern = new RegExp('!\\[Uploading ' + file.name + ' [0-9]+%\\]\\(\\)');
                $textarea.val(head + tag + tail);

                var uploader = new qcode.Uploader({
                    file: file,
                    chunkSize: options.chunkSize,
                    url: options.uploadURL,
                    postData: options.postData
                });

                $(uploader)
                        .on('progress', function(event) {
                            var perct = parseInt((event.loaded / event.total) * 100);
                            $textarea.val(
                                $textarea.val().replace(tagPattern, "![Uploading " + file.name + " " + perct + "%]()")
                            );
                        })
                        .on('complete', function(event, xhr) {
                            var url = options.getImageURL(xhr, file);
                            $textarea.val(
                                $textarea.val().replace(tagPattern, '![image](' + url + ')')
                            );
                        })
                        .on('error', function(event, xhr) {
                            $textarea.val(
                                $textarea.val().replace(tagPattern, '![Error uploading ' + file.name + ']()')
                            );
                            $textarea.trigger('error', [xhr]);
                        });
                uploader.start();
            });
        };
    });
    return this;
};