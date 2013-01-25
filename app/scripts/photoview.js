var PhotoView = Backbone.View.extend({
  tagName: 'div',
  className: 'image',

  events: {
    'click': 'openImageLink'
  },

  render: function() {
    var image = this.model;
    this.$el.append('<img src="' + image.url + '" />')

    // randomize side to throw from

    var side = Math.floor(Math.random() * 4);

    switch (side) {
      case 0: // top
        this.$el.css({ top: this.options.imageLength * -1, left: this._randomX() });
        break;
      case 1: // right
        this.$el.css({ top: this._randomY(), left: window.innerWidth });
        break;
      case 2: // bottom
        this.$el.css({ top: window.innerHeight, left: this._randomX() });
        break;
      case 3: // left
        this.$el.css({ top: this._randomY(), left: this.options.imageLength * -1 });
        break;
    }

    $('#board').append(this.$el);

    // randomize throw

    var spin = 1;
    if (Math.round(Math.random()) == 0) {
      spin = -1;
    }

    var rotateOffset = Math.floor(Math.random() * 15);
    var spinCount = Math.floor(Math.random() * 2); // 0 or 1

    var rotate = ((360 * spinCount) + rotateOffset) * spin;

    if (spinCount == 0) {
      // if no spin, do half a spin
      this.$el.css({ rotate: 180 });
    }

    var left = this._randomX();
    var top = this._randomY();

    this.$el
      .transition({ left: left, top: top, rotate: rotate, easing: 'snap', duration: 1500 })
      .transition({ opacity: 0, delay: this.options.fadeDelayMS }, this.options.fadeOutMS, 'in', function() {
        this.remove();
      });
  },

  openImageLink: function() {
    window.open(this.model.link);
  },

  _randomX: function() {
    return Math.floor(Math.random() * (window.innerWidth - options.imageLength));
  },

  _randomY: function() {
    return Math.floor(Math.random() * (window.innerHeight - options.imageLength));
  }
});
