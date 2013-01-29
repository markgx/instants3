var SettingsView = Backbone.View.extend({
  initialize: function() {
    $('[name=feed-type][value=' + localStorage.feedType + ']').prop('checked', true);
  },

  render: function(e) {
    e.stopPropagation();

    this.$el.css({ 'opacity': 0 }).show();
    this.$el.transit({ opacity: 1 }, 200);

    var self = this;

    $('html').on('click', function(e) {
      if ($(e.target).attr('id') !== 'settings-menu' && $(e.target).parents('#settings-menu').length === 0) {
        self.$el.transit({ opacity: 0 }, 200, function() {
          $(this).hide();
        });

        $(this).unbind(e);
      }
    })
  },

  events: {
    'change .feed-type': 'changeFeedType',
    'click .sign-out': 'signOut'
  },

  changeFeedType: function(e) {
    var feedType = parseInt($('.feed-type:checked').val());
    localStorage.feedType = feedType;
    this.options.parentView.switchFeed(feedType);
  },

  signOut: function(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  }
});
