var AboutView = Backbone.View.extend({
  render: function() {
    $('#overlay').show();

    this.$el.css({ 'opacity': 0 }).show();
    this.$el.transit({ opacity: 1 }, 200);

    var self = this;

    $('#overlay').on('click', function(e) {
      var $overlay = $(this);
      self.$el.transit({ opacity: 0 }, 200, function() {
        $(this).hide();
        $overlay.hide();
      });
    });
  },
});
