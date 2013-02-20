var PhotoView = Backbone.View.extend({
  tagName: 'div',
  className: 'image',

  events: {
    'click': 'openImageLink'
  },

  render: function() {
    var image = this.model;
    this.$el.append('<img src="' + image.url + '" /><div class="username">' + image.username + '</div>')

    // always show username is checked
    if (localStorage.showUsernames == 'true') {
      $('.username', this.$el).addClass('show');
    }

    // randomize side to throw from

    var side = Math.floor(Math.random() * 4);
    var currentX, currentY;

    switch (side) {
      case 0: // top
        currentX = this._randomX();
        currentY = this.options.imageLength * -1;
        break;
      case 1: // right
        currentX = window.innerWidth;
        currentY = this._randomY();
        break;
      case 2: // bottom
        currentX = this._randomX();
        currentY = window.innerHeight;
        break;
      case 3: // left
        currentX = this.options.imageLength * -1;
        currentY = this._randomY();
        break;
    }

    this.$el.css({ top: currentY, left: currentX });

    // spin clockwise or counter-clockwise
    var spin = 1;
    if (Math.round(Math.random()) === 0) {
      spin = -1;
    }

    // how many spins - half or one (spinCount = 0 means half)
    var spinCount = Math.floor(Math.random() * 2); // 0 or 1

    if (spinCount === 0) {
      // if no spin, do half a spin
      this.$el.css({ rotate: 180 });
    }

    // rotation random offset
    var rotateOffset = Math.floor(Math.random() * 15);
    var newRotate = ((360 * spinCount) + rotateOffset) * spin;

    $('#board').append(this.$el);

    var translateX = (this._randomX() - currentX);
    var translateY = (this._randomY() - currentY);

    this.$el
      .transition({ x: translateX, y: translateY, rotate: newRotate, easing: 'snap', duration: 1500 })
      .transition({ opacity: 0, delay: this.options.fadeDelayMS }, this.options.fadeOutMS, 'in', function() {
        this.remove();
      });
  },

  openImageLink: function() {
    window.open(this.model.link);
  },

  _randomX: function() {
    return Math.floor(Math.random() * (window.innerWidth - options.imageLength - 15)); // padding
  },

  _randomY: function() {
    return Math.floor(Math.random() * (window.innerHeight - options.imageLength - 85)); // padding
  }
});
