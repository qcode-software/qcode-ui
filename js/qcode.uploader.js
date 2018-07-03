// ================================================================================
// Uploader plugin
// eg.
/*
  var uploader = new Uploader {
    "file": file,
    "chunkSize": 1048576, //(optional, defaults to 1MiB)
    "url": '/upload',
    "batchSize": 3 //(optional, defaults to Infinity)
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
qcode.Uploader = (function(undefined) {
    "use strict";
    var Uploader = function(options) {
        this.id = guidGenerate();
        this.file = options.file;

        // Maximum size (in bytes) of each chunk
        if ( options.chunkSize ) {
            this.chunkSize = bytesWithUnits2Int(options.chunkSize);
        } else {
            this.chunkSize = bytesWithUnits2Int("1MiB");
        }

        // Maximum number of chunks per batch
        if ( options.batchSize ) {
            this.batchSize = options.batchSize;
        } else {
            this.batchSize = Infinity;
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

            // Constructor function for new batch
            function Batch(chunks,startIndex,totalChunkCount) {
                this.chunks = chunks;
                this.startIndex = startIndex;
                this.totalChunkCount = totalChunkCount;
            }
            jQuery.extend(Batch.prototype, {
                done: function(callback) {
                    this.callback = callback;
                },
                resolve: function(xhr) {
                    this.callback(xhr);
                },
                start: function() {
                    var batch = this;
                    var requests = [];
                    this.chunks.forEach(function(chunk, i) {
                        var index = batch.startIndex + i;
                        var xhr = new XMLHttpRequest();
                        requests.push(xhr);

                        var data = new FormData();
                        data.append('name',uploader.id);
                        data.append('chunk',index);
                        data.append('chunks',batch.totalChunkCount);
                        data.append('file',chunk);
                        data.append('filename',file.name);
                        data.append('mime_type',file.type);
                        if ( uploader.options.postData ) {
                            jQuery.each(uploader.options.postData,
                                        function(name, value) {
                                            data.append(name,value);
                                        });
                        }
                        
                        xhr.onreadystatechange = function() {
                            // Listen for request success / failure
                            if ( xhr.readyState != xhr.DONE ) {
                                return;
                            }

                            // Request failed - cancel any outstanding
                            // requests and trigger error event
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

                            chunkProgress[index] = chunk.size;
                            progress();
                            
                            if ( requests.every(function(request) {
                                return ( request.readyState == request.DONE );
                            }) ) {
                                batch.resolve(xhr);
                            }
                        }
                    
                        xhr.onprogress = function(event) {
                            if ( event.lengthComputable ) {
                                chunkProgress[index] =
                                        chunk.size * event.loaded / event.total;
                                progress();
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
            var chunkCount = chunks.length;

            // Batch the chunks
            var chunkBatches = [];
            if ( chunks.length > this.batchSize ) {
                var batchCount = Math.ceil(chunks.length / this.batchSize);
                for (var i = 0; i < batchCount; i++) {
                    var start = i * this.batchSize;
                    var end = start + this.batchSize;
                    chunkBatches[i] = chunks.slice(start,end);
                }
            } else {
                chunkBatches[0] = chunks;
            }

            // Create batches to upload the chunks, begin upload
            var batches = [];
            chunkBatches.forEach(function(chunks, i) {
                if ( uploader.batchSize === Infinity ) {
                    var firstChunk = 0;
                } else {
                    var firstChunk = i * uploader.batchSize;
                }
                var batch = new Batch(chunks,firstChunk,chunkCount);
                batches.push(batch);
                if ( i > 0 ) {
                    batches[i - 1].done(batch.start.bind(batch));
                }
            });
            batches[batches.length - 1].done(function(xhr){
                $(uploader).trigger('complete', [xhr]);
            });
            batches[0].start();

            // Function & array to track total upload progress
            var chunkProgress = [];
            function progress() {
                var totalProgress = 0;
                chunkProgress.forEach(function(progress,index) {
                    if ( progress !== undefined ) {
                        totalProgress += progress;
                    }
                });
                $(uploader).trigger(jQuery.Event('progress',{
                    loaded: totalProgress,
                    total: file.size
                }));
            }
        }
    });
    return Uploader;
})();
// ================================================================================
