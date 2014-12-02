/*
  imagePasteTarget plugin
  handle paste events containing images on the target element
*/
$.fn.imagePasteTarget = function(handleFiles) {
    this.on('paste', function (event) {
        var files = [];
        Array.prototype.forEach.call(event.originalEvent.clipboardData.items, function(item) {
            if ( item.kind === "file" ) {
                files.push(item.getAsFile());
            }
        });
        if ( file.length > 0 ) {
            handleFiles(files);
        }
    });
    return this;
};