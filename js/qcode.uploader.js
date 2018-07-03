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

// Use namespace object and immediately-invoked function expression
// to limit scope
var qcode = qcode || {};
qcode.Uploader = (function(undefined) {
    "use strict";

    // Constructor function to export
    var Uploader = function(options) {
        // Generate a unique id for this upload
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
            // Begin the upload
            var uploader = this;
            var file = this.file;
            var chunkSize = this.chunkSize;

            // Constructor function for new batch of requests
            function Batch(chunks,startIndex,totalChunkCount) {
                this.chunks = chunks; // array of file chunks to upload
                this.startIndex = startIndex; // index of first chunk
                this.totalChunkCount = totalChunkCount; // total count of chunks
                this.callbacks = [];
            }
            jQuery.extend(Batch.prototype, {
                done: function(callback) {
                    // Add a callback function, to be called when request
                    // batch is complete
                    this.callbacks.push(callback);
                },
                _resolve: function(xhr) {
                    // (Private) requests are complete, run the callbacks
                    // with the last request object to resolve
                    if ( this.callbacks.length > 0 ) {
                        this.callbacks.foreach(function(callback,i){
                            callback(xhr);
                        });
                    }
                },
                start: function() {
                    // Start the request batch
                    var batch = this;
                    var requests = [];

                    // Create a request for each chunk in batch
                    this.chunks.forEach(function(chunk, i) {
                        var index = batch.startIndex + i;
                        var xhr = new XMLHttpRequest();
                        requests.push(xhr);

                        // Form data sent with each request
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

                        // Request event listeners:
                        
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

                            // Mark this chunk as 100% complete
                            // and update progress
                            chunkProgress[index] = chunk.size;
                            progress();

                            // Check if all requests in batch are complete
                            if ( requests.every(function(request) {
                                return ( request.readyState == request.DONE );
                            }) ) {
                                batch._resolve(xhr);
                            }
                        }

                        // Listen for "progress" event, where supported
                        xhr.onprogress = function(event) {
                            if ( event.lengthComputable ) {
                                chunkProgress[index] =
                                        chunk.size * event.loaded / event.total;
                                progress();
                            }
                        };

                        // Open the request so headers can be sent
                        xhr.open('POST', uploader.url);

                        // Set request headers
                        $.each(uploader.headers, function(header, value) {
                            xhr.setRequestHeader(header, value);
                        });

                        // Send request data
                        xhr.send(data);
                    });
                }
            });
            // End of "Batch" definition

            // Continue with "start upload"

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

            // Create request batch objects to upload the chunks, begin upload
            var batches = [];
            chunkBatches.forEach(function(chunks, i) {

                // Loop should only run once if batchSize === Infinity
                // firstChunk index will be 0
                if ( uploader.batchSize === Infinity ) {
                    var firstChunk = 0;
                } else {
                    var firstChunk = i * uploader.batchSize;
                }

                // Create new batch object
                var batch = new Batch(chunks,firstChunk,chunkCount);
                
                batches.push(batch);

                // Chain batches - when previous batch is done, start this one
                if ( i > 0 ) {
                    batches[i - 1].done(batch.start.bind(batch));
                }
            });

            // When final batch is done, trigger uploader complete
            batches[batches.length - 1].done(function(xhr){
                $(uploader).trigger('complete', [xhr]);
            });

            // Start first batch
            batches[0].start();

            // Function to track total upload progress
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
