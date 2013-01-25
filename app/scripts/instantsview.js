var InstantsView = Backbone.View.extend({
  initialize: function() {
    this.loggedIn = false;

    if (localStorage.accessToken) {
      this.instagram = new Instagram(this.options.clientID, this.options.callbackURL, '', localStorage.accessToken);
      this.loggedIn = true;
    } else {
      this.instagram = new Instagram(this.options.clientID, this.options.callbackURL, '');
    }

    this.imageList = new ImageList();
  },

  events: {
    'click .auth': 'authorize',
    'click #about-trigger a': 'toggleAbout',
    'click #close a': 'hideAbout'
  },

  render: function() {
    if (this.loggedIn) {
      var self = this;
      var loadFunction = null;

      if (this.options.feedType === FEED_TYPES.FEED) {
        loadFunction = this._loadFeedImages;
      } else {
        loadFunction = this._loadPopularImages;
      }

      loadFunction.call(self).success(function() {
        self.interval = setInterval(function() {
          self._showImage();
        }, options.intervalMS);

        // call twice -- better way to do this?
        setTimeout(function() { loadFunction.call(self); }, 20000);
      });
    } else {
      $('#welcome').show();
    }
  },

  authorize: function(e) {
    e.preventDefault();
    this.instagram.authorize();
  },

  toggleAbout: function(e) {
    e.preventDefault();
    $('#about').toggle();
  },

  hideAbout: function(e) {
    e.preventDefault();
    $('#about').hide();
  },

  _loadFeedImages: function() {
    var self = this;

    return this.instagram.getUserFeed(function(result) {
      self.nextMaxId = result.pagination.next_max_id; // if fetching more images, start from this id
      self._processFeedResults(result);
    }, 30, null, self.nextMaxId);
  },

  _loadPopularImages: function() {
    var self = this;

    return this.instagram.getPopularFeed(function(result) {
      self._processFeedResults(result);
    });
  },

  _processFeedResults: function(result) {
    var self = this;

    var images = _.map(result.data, function(o) {
      return {
        id: o.id,
        url: o.images.low_resolution.url,
        link: o.link,
        username: o.user.username
      };
    });

    // preload images
    _(images).each(function(el) {
      self.imageList.add(el);
      $('<img />').attr('src', el.url).appendTo('#preload').css('display','none');
    });
  },

  _showImage: function() {
    var image = this.imageList.getNextImage();
    var viewOptions = _({ model: image })
      .extend(_(this.options)
        .pick('imageLength', 'fadeDelayMS', 'fadeOutMS'));
    var photoView = new PhotoView(viewOptions);
    photoView.render();
  }
});
