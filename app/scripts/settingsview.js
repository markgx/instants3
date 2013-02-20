var SettingsView = Backbone.View.extend({
  initialize: function() {
    $('[name=feed-type][value=' + localStorage.feedType + ']').prop('checked', true);

    if (localStorage.showUsernames == 'true') {
      $('[name=show-usernames]').prop('checked', true);
    }

    if (!screenfull.enabled) {
      $('#full-screen-option').hide();
    }
  },

  render: function(e) {
    e.stopPropagation();

    this.$el.css({ 'opacity': 0 }).show();
    this.$el.transit({ opacity: 1 }, 200);

    var self = this;

    this._setFullScreenOptionText();

    $('html').on('click.settings', function(e) {
      if ($(e.target).attr('id') !== 'settings-menu' && $(e.target).parents('#settings-menu').length === 0) {
        self._hideMenu();
      }
    })
  },

  events: {
    'change .feed-type': 'changeFeedType',
    'change .show-usernames': 'changeShowUsernames',
    'click .full-screen': 'toggleFullScreen',
    'click .sign-out': 'signOut'
  },

  changeFeedType: function(e) {
    var feedType = parseInt($('.feed-type:checked').val());
    localStorage.feedType = feedType;
    this.options.parentView.switchFeed(feedType);
    this._hideMenu();
  },

  changeShowUsernames: function(e) {
    var isChecked = $('[name=show-usernames]').prop('checked');
    localStorage.showUsernames = isChecked;

    if (isChecked) {
      $('.image .username').addClass('show');
    } else {
      $('.image .username').removeClass('show');
    }
  },

  toggleFullScreen: function(e) {
    e.preventDefault();

    screenfull.toggle();
    this._setFullScreenOptionText();

    this._hideMenu();
  },

  _setFullScreenOptionText: function() {
    if (screenfull.isFullscreen) {
      $('#full-screen-option a').text('Exit full screen');
    } else {
      $('#full-screen-option a').text('Enter full screen');
    }
  },

  signOut: function(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  },

  _hideMenu: function() {
    this.$el.transit({ opacity: 0 }, 200, function() {
      $(this).hide();
      $('html').off('click.settings'); // unbind overlay click handler
    });
  }
});
