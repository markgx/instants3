var InstantsView = Backbone.View.extend({
  loadIntervalID: null,

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

    if (localStorage.showUsernames == null) {
      localStorage.showUsernames = false;
    }

    this.imageList = new ImageList();
    this.aboutView = new AboutView({ el: $('#about') });
    this.settingsView = new SettingsView({ el: $('#settings-menu'), parentView: this });
    this.loadImagesFnQueue = [];
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
      var callCount;

      if (parseInt(localStorage.feedType) === FEED_TYPES.FEED) {
        loadImageFn = this._loadFeedImages;
        callCount = 3;
      } else {
        loadImageFn = this._loadPopularImages;
        callCount = 5;
      }

      for (var i = 0; i < callCount; i++) {
        this.loadImagesFnQueue.push({ loadImageFn: loadImageFn, imageList: this.imageList });
      }

      this._callLoadImageFn();
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
    this.loadImagesFnQueue = [];
    clearInterval(this.loadIntervalID);
    this.loadIntervalID = null;

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

  _callLoadImageFn: function() {
    if (this.loadImagesFnQueue.length === 0) {
      return;
    }

    var fnEl = this.loadImagesFnQueue.shift();
    var loadImageFn = fnEl.loadImageFn;
    var imageList = fnEl.imageList;
    var self = this;

    if (self.loadIntervalID == null) {
      $('#spinner').show();
    }

    loadImageFn.call(this, imageList).success(function() {
      if (self.loadIntervalID == null) {
        self.loadIntervalID = setInterval(function() {
          self._showImage();
        }, self.options.intervalMS);
      }

      $('#spinner').hide();

      self.pendingLoad = setTimeout(function() {
        self._callLoadImageFn.call(self, self.imageList);
      }, 20000);
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
