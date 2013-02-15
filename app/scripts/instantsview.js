var InstantsView = Backbone.View.extend({
  initialize: function() {
    this.loggedIn = false;

    if (localStorage.accessToken) {
      this.instagram = new Instagram(this.options.clientID, this.options.callbackURL, '', localStorage.accessToken);
      this.loggedIn = true;
    } else {
      this.instagram = new Instagram(this.options.clientID, this.options.callbackURL, '');
    }

    if (localStorage.feedType == null) {
      localStorage.feedType = FEED_TYPES.FEED;
    }

    this.imageList = new ImageList();
    this.aboutView = new AboutView({ el: $('#about') });
    this.settingsView = new SettingsView({ el: $('#settings-menu'), parentView: this });
  },

  events: {
    'click .auth': 'authorize',
    'click #about-icon': 'showAbout',
    'click #settings-icon': 'showSettings'
  },

  render: function() {
    if (this.loggedIn) {
      var self = this;
      var loadImageFn = null;

      if (parseInt(localStorage.feedType) === FEED_TYPES.FEED) {
        loadImageFn = this._loadFeedImages;
      } else {
        loadImageFn = this._loadPopularImages;
      }

      $('#spinner').show();

      loadImageFn.call(self, self.imageList).success(function() {
        self.interval = setInterval(function() {
          self._showImage();
        }, options.intervalMS);

        // call twice -- better way to do this?
        self.pendingLoad = setTimeout(function() {
          loadImageFn.call(self, self.imageList);
        }, 20000);

        $('#spinner').hide();
      });
    } else {
      $('#welcome').show();
      $('#settings-icon').parent().hide(); // hide settings icon
    }
  },

  authorize: function(e) {
    e.preventDefault();
    this.instagram.authorize();
  },

  showAbout: function(e) {
    e.preventDefault();
    this.aboutView.render();
  },

  showSettings: function(e) {
    e.preventDefault();
    this.settingsView.render(e);
  },

  switchFeed: function(feedType) {
    clearInterval(this.interval);

    if (this.pendingLoad) {
      clearTimeout(this.pendingLoad);
    }

    this.nextMaxId = null; // reset feed max ID
    this.imageList = new ImageList();
    this.render();
  },

  _loadFeedImages: function(imageList) {
    var self = this;

    return this.instagram.getUserFeed(function(result) {
      self.nextMaxId = result.pagination.next_max_id; // if fetching more images, start from this id
      self._processFeedResults(result, imageList);
    }, 30, null, self.nextMaxId);
  },

  _loadPopularImages: function(imageList) {
    var self = this;

    return this.instagram.getPopularFeed(function(result) {
      self._processFeedResults(result, imageList);
    });
  },

  _processFeedResults: function(result, imageList) {
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
      imageList.add(el);
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
