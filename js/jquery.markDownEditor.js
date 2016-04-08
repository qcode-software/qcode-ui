/*
  markDownEditor
  Call on a textarea. Converts markdown within the textarea to html and displays it in the preview panel.
  Also uses markDownUploadHandler plugin on textarea to support file upload and generate image 
  or link tag depending upon the type of file uploaded.
  Requires
  1. an upload url
  2. a function that takes the xmlHttpRequest response and/or the file object and returns the file/image source url.
  3. preview panel element
  4. upload button element
  5. a function that takes the markdown and returns html
  options = {
    uploadURL: string,    
    getFileURL: function(xmlHttpRequest, file) {return string},
    previewPanel: preview element object,
    uploadButton: button element object,
    markdownToHtml: function(markdown) {return string (html)}
    isImage: function(xmlHttpRequest, file) {return boolean} (optional)  
    chunkSize: string (optional, default "10KiB")
  }
*/

$.widget("qcode.markDownEditor", {
    // Default options.
    options: {
	isImage: function(xhr, file) {
	    var mime_type = file.type;
	    var index = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].indexOf(mime_type);
	    return (index > -1);
	},
	chunkSize: "10KiB"
    },

    _create: function() {
	// Options are already merged and stored in this.options
	// Plugin logic goes here.
	var $textarea = this.element;

	/* Get a handler for uploading images and inserting
	   them into the markdown */
	var handler = $textarea.markDownUploadHandler1({
	    uploadURL: this.options.uploadURL,
	    getFileURL: this.options.getFileURL,
	    isImage: this.options.isImage,
	    chunkSize: this.options.chunkSize
	});
	/* Use the handler to enable image drag-and-drop,
	   image pasting, and an image upload "button" */
	$textarea.fileDropZone(handler);
	$textarea.imagePasteTarget(handler);
	this.options.uploadButton.fileUploadButton(handler);

	/* Apply css styles to the textarea while dragging
	   and dropping images over it.*/
	$textarea.on('dragenter', function() {
	    $(this).addClass('drag-hover');
	});
	$textarea.on('dragleave drop', function() {
	    $(this).removeClass('drag-hover');
	});
    },
    update: function() {
	// Converts markdown in the textarea to html and
	// updates the content of preview panel with the html
	var html = this.options.markdownToHtml(this.element.val());
	this.options.previewPanel.html(html);
    }
});
