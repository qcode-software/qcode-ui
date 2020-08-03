// ================================================================================
// Uploader plugin
// eg.
/*
  var uploader = new Uploader {
    "file": file,
    "chunkSize": 1048576, //(optional, defaults to 1MiB)
    "url": '/upload',
    "batchSize": 3 //(optional, defaults to Infinity)
    "crossDomainRequest": false //(optional, allows cross doamin request with credentials if true)
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

    // Constructor function for new batch of requests
    function Batch(options) {
        this.chunks = options.chunks; // array of file chunks to upload
        this.startChunkIndex = options.startChunkIndex; // index of first chunk
        this.totalChunkCount = options.totalChunkCount; // total count of chunks
    }
    jQuery.extend(Batch.prototype, {
        start: function(url,headers,postData,crossDomainRequest) {
            // Start the request batch
            var batch = this;
            var requests = [];

            // Create a request for each chunk in batch
            this.chunks.forEach(function(chunk, i) {
                var chunkIndex = batch.startChunkIndex + i;
                var xhr = new XMLHttpRequest();
                requests.push(xhr);

                // Form data sent with each request
                var data = new FormData();
                data.append('chunk',chunkIndex);
                data.append('chunks',batch.totalChunkCount);
                data.append('file',chunk);
                if ( postData ) {
                    jQuery.each(postData,
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
                        $(batch).trigger('error',[xhr]);
                        return;
                    }

                    // Mark this chunk as 100% complete
                    // and update progress
                    $(batch).trigger('progress',[chunkIndex,chunk.size]);

                    // Check if all requests in batch are complete
                    if ( requests.every(function(request) {
                        return ( request.readyState == request.DONE );
                    }) ) {
                        $(batch).trigger('done',[xhr]);
                    }
                }

                // Listen for "progress" event, where supported
                xhr.onprogress = function(event) {
                    if ( event.lengthComputable ) {
                        $(batch).trigger('progress',[
                            chunkIndex,
                            chunk.size * event.loaded / event.total
                        ]);
                    }
                };

                // Property to allow cross domain request
                // with credentials e.g. cookies
                xhr.withCredentials = crossDomainRequest;

                // Open the request so headers can be sent
                xhr.open('POST', url);

                // Set request headers
                $.each(headers, function(header, value) {
                    xhr.setRequestHeader(header, value);
                });

                // Send request data
                xhr.send(data);
            });
        }
    });
    // End of "Batch" definition

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

        // Cross domain request with credentials
        if ( options.crossDomainRequest ) {
            this.crossDomainRequest = options.crossDomainRequest;
        } else {
            this.crossDomainRequest = false;
        }
        
        this.url = options.url;
        this.headers = $.extend({
            'X-Authenticity-Token': Cookies.get('authenticity_token')
        }, options.headers);

        this.postData = $.extend({
            filename: this.file.name,
            mime_type: this.file.type,
            name: this.id
        }, options.postData);

        this.chunkProgress = []; // array of bytes uploaded
    }
    
    jQuery.extend(Uploader.prototype, {
        start: function() {
            // Begin the upload
            var uploader = this;
            var file = this.file;
            var chunks = this._chunkFile(file,this.chunkSize); // array of blobs (file slices)
            var batches = this._createBatches(chunks,this.batchSize);

            batches.forEach(function(batch,i){
                // Chain batches - when previous batch is done, start this one
                if ( i > 0 ) {
                    $(batches[i - 1]).on('done',function(event,xhr) {
                        batch.start(
                            uploader.url,
                            uploader.headers,
                            uploader.postData,
                            uploader.crossDomainRequest
                        )
                    });
                }
                $(batch).on('progress',function(event,chunkIndex,bytes) {
                    uploader.setChunkProgress(chunkIndex,bytes);
                    uploader.updateProgress();
                });
                $(batch).on('error',function(event,xhr) {
                    $(uploader).trigger('error', [xhr]);
                });
            });
            
            // When final batch is done, trigger uploader complete
            $(batches[batches.length - 1]).on('done',function(event,xhr) {
                $(uploader).trigger('complete', [xhr]);
            });

            // Start first batch
            batches[0].start(
                uploader.url,
                uploader.headers,
                uploader.postData,
                uploader.crossDomainRequest
            );
        },
        setChunkProgress: function(chunkIndex, bytes) {
            // Set the number of bytes uploaded
            this.chunkProgress[chunkIndex] = bytes;
        },
        updateProgress: function() {
            // Function to track total upload progress
            var totalProgress = 0;
            var uploader = this;
            this.chunkProgress.forEach(function(progress,index) {
                if ( progress !== undefined ) {
                    totalProgress += progress;
                }
            });
            $(uploader).trigger({
                type: 'progress',
                loaded: totalProgress,
                total: uploader.file.size
            });
        },
        _chunkFile: function(file,chunkSize) {
            // Split a file into an array of chunks
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
            return chunks;
        },
        _createBatches: function(chunks, batchSize) {
            // Create request batch objects to upload the chunks, return array
            var batches = [];
            if ( chunks.length > batchSize ) {
                var batchCount = Math.ceil(chunks.length / batchSize);
                for (var i = 0; i < batchCount; i++) {
                    var start = i * batchSize;
                    var end = start + batchSize;
                    var batch = new Batch({
                        chunks: chunks.slice(start,end),
                        startChunkIndex: start,
                        totalChunkCount: chunks.length
                    });
                    batches.push(batch);
                }
            } else {
                batches[0] = new Batch({
                    chunks: chunks,
                    startChunkIndex: 0,
                    totalChunkCount: chunks.length
                });
            }

            return batches;
        }
    });
    return Uploader;
})();
// ================================================================================
