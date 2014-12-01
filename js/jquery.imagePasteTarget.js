$.fn.imagePasteTarget = function(handleFiles) {
    this.on('paste', function (event) {
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
                handleFiles([file]);
            }
        };
    });
    return this;
}