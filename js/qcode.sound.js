;var qcode = qcode || {};
/*
  qcode.Sound
  simple sound API (currently webkit only)

  Create a new sound object with "new qcode.Sound(url)";
  test if sound has loaded with property "loaded" (boolean)
  listen for loading with jQuery "load" event
  play with method "play()";

  eg.
  var mySound = new qcode.Sound('/Sounds/demo.wav');
  $(mySound).on('load', function() {
    mySound.play();
  });
*/
(function(window, undefined) {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    if ( window.AudioContext === undefined ) {
        qcode.Sound = {
            supported: false
        }
    } else {
        var context = new AudioContext();
        qcode.Sound = function(url) {
            this.loaded = false;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            var sound = this;
            request.onload = function() {
                context.decodeAudioData(request.response, function(buffer) {
                    sound._buffer = buffer;
                    sound.loaded = true;
                    jQuery(sound).trigger('load');
                });
            }
            request.send();
        }
        jQuery.extend(qcode.Sound.prototype, {
            play: function() {
                if ( ! this.loaded ) {
                    $(this).on('load', this.play.bind(this));
                } else {
                    var source = context.createBufferSource();
                    source.buffer = this._buffer;
                    source.connect(context.destination);
                    source.start(0);
                }
            }
        });
        qcode.Sound.supported = true;
    }
})(window);