/*
  filePasteTarget plugin
  handle paste events containing files on the target element
*/
$.fn.filePasteTarget = function(handleFiles) {
    this.on('paste', function (event) {
        var files = [];
        Array.prototype.forEach.call(event.originalEvent.clipboardData.items, function(item) {
            if ( item.kind === "file" ) {
                files.push(item.getAsFile());
            }
        });
        if ( files.length > 0 ) {
            handleFiles(files);
        }
    });
    return this;
};