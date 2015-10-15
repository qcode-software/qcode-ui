// ================================================================================
// Uploader plugin
// eg.
/*
  var uploader = new Uploader {
  "file": file,
  "chunkSize": 1048576, //(optional, defaults to 1MiB)
  "url": '/upload'
  };
  $(uploader)
  .on('progress', function progressHandler(event) {
  var complete = event.loaded / event.total;
  })
  .on('complete', function uploadHandler(event, xhr) {})
  .on('error', function errorHandler(event, xhr) {});
  uploader.start();

  proc /upload {name chunk chunks file filename mime_type} {
  }
*/
var qcode = qcode || {};
qcode.Uploader = (function() {
    var Uploader = function(options) {
        this.id = guidGenerate();
        this.file = options.file;
        if ( options.chunkSize ) {
            this.chunkSize = bytesWithUnits2Int(options.chunkSize);
        } else {
            this.chunkSize = bytesWithUnits2Int("1MiB");
        }
        this.url = options.url;
        this.headers = $.extend({
            'X-Authenticity-Token': Cookies.get('authenticity_token')
        }, options.headers);
        this.options = options;
    }
    jQuery.extend(Uploader.prototype, {
        start: function() {
            var uploader = this;
            var file = this.file;
            var chunkSize = this.chunkSize;

            // Chunk the file
            var chunks = [];
            if ( file.size > chunkSize ) {
                var start = 0;
                var end = start + chunkSize;
                while ( start < file.size ) {
                    chunks.push(file.slice(start,end));
                    start = end;
                    end = start + chunkSize;
                }
            } else {
                chunks.push(file);
            }

            // Upload the chunks
            var requests = [];
            var chunkProgress = [];
            chunks.forEach(function(chunk, index) {
                var xhr = new XMLHttpRequest();
                requests.push(xhr);

                var data = new FormData();
                data.append('name',uploader.id);
                data.append('chunk',index);
                data.append('chunks',chunks.length);
                data.append('file',chunk);
                data.append('filename',file.name);
                data.append('mime_type',file.type);
                if ( uploader.options.postData ) {
                    jQuery.each(uploader.options.postData, function(name, value) {
                        data.append(name,value);
                    });
                }

                xhr.onreadystatechange = function() {
                    if ( xhr.readyState != xhr.DONE ) {
                        return;
                    }
                    if ( xhr.status != 200 ) {
                        jQuery.each(requests, function(i, request) {
                            if ( request !== xhr ) {
                                request.onreadystatechange = null;
                                request.onprogress = null;
                                request.abort();
                            }
                        });
                        $(uploader).trigger('error', [xhr]);
                        return;
                    }
                    if ( requests.every(function(request) {
                        return ( request.readyState == request.DONE );
                    }) ) {
                        $(uploader).trigger('complete', [xhr]);
                    }
                }
                xhr.onprogress = function(event) {
                    if ( event.lengthComputable ) {
                        chunkProgress[index] = chunk.size * event.loaded / event.total;
                        var totalProgress = 0;
                        $.each(chunkProgress, function(index, progress) {
                            if ( progress !== undefined ) {
                                totalProgress += progress;
                            }
                        });
                        $(uploader).trigger(jQuery.Event('progress',{
                            loaded: totalProgress,
                            total: file.size
                        }));
                    }
                };
                
                xhr.open('POST', uploader.url);
                
                $.each(uploader.headers, function(header, value) {
                    xhr.setRequestHeader(header, value);
                });

                xhr.send(data);
            });
        }
    });
    return Uploader;
})();
// ================================================================================