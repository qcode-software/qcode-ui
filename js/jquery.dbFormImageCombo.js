// A widget containing a dbFormCombo which allows the user to choose a filename, and an image that is updated when they do.
;(function($, undefined) {
    $.widget('qcode.dbFormImageCombo', {
        options: {
            noImageURL: "/Graphics/noimage.png",
            loadingImageURL: "/Graphics/animated_progress.gif"
        },
        _create: function() {
            // Attempt to load the "loading" image and the "no image" image into the browser cache, if they aren't already there
            this.preLoader = new Image();
            this.preLoader.src = this.options.loadingImageURL;
            this.preLoader.src = this.options.noImageURL;

            // Load options from attributes
            this.input = this.element.find('input');
            this.options = $.extend({
	        searchURL: $(this.input).attr('searchURL'),
	        boundName: $(this.input).attr('boundName'),
	        searchLimit: $(this.input).attr('searchLimit'),
	        comboWidth: $(this.input).attr('comboWidth'),
	        comboHeight: $(this.input).attr('comboHeight'),
                imageURL: $(this.input).attr('imageURL')
            }, this.options);

            // Use dbFormCombo to handle the filename options combo
            this.input.dbFormCombo({
	        searchURL: this.options.searchURL,
	        boundName: this.options.boundName,
	        searchLimit: this.options.searchLimit,
	        comboWidth: this.options.comboWidth,
	        comboHeight: this.options.comboHeight
	    })

            // Update the image when a new filename is chosen
            this.image = this.element.find('img');
            this._on(this.input, {
                'comboSelect': this.loadImage,
                'comboBlur': this.loadImage
            });

            // Add a wrapper to cope with change in image size
            this.image.wrap('<div>');
            this.imageWrapper = this.image.parent();
            this.imageWrapper.addClass('image-wrapper');
        },
        loadImage: function() {
            // Attempt to load a new image based on the chosen filename
            var filename = this.input.val();
            if (filename) {
                this.image.attr('src', this.options.loadingImageURL);
                this._whenLoaded(function() {
                    this.image.attr('src', urlSet(this.options.imageURL, 'filename', filename));
                    this._whenLoaded(function() {
                        this.imageWrapper.stop().animate({
                            'width': this.image.width() + "px",
                            'height': this.image.height() + "px",
                            'line-height': this.image.height() + "px"
                        });
                    });
                });
            } else {
                this.image.attr('src', this.options.noImageURL);
                this._whenLoaded(function() {
                    this.imageWrapper.stop().animate({
                        'width': this.image.width() + "px",
                        'height': this.image.height() + "px",
                        'line-height': this.image.height() + "px"
                    });
                });
            }
        },
        _whenLoaded: function(callback) {
            // Call the callback function when the image is finished loading -
            // Some browsers will not fire a load event when the image is already cached.
            var img = this.image[0];
            if (img.complete || img.readyState == 'complete') {
                callback.call(this);
            } else {
                this.image.one('load', callback.bind(this));
            }
        }
    });
})(jQuery);