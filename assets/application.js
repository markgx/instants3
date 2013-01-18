function ImageList() {
  this.imageArray = [];
  this.currentIndex = 0;
}

ImageList.prototype.add = function(image) {
  if (_(this.imageArray).where({ id: image.id }).length == 0) {
    this.imageArray.push(image);
  }
}

ImageList.prototype.getNextImage = function() {
  if (this.currentIndex >= this.imageArray.length) {
    this.currentIndex = 0;
  }

  var currentImage = this.imageArray[this.currentIndex];
  this.currentIndex++;
  return currentImage;
}

ImageList.prototype.getArray = function() {
  return this.imageArray;
}

function loadPopularImages(instagram, imageList) {
  return instagram.getPopularFeed(function(result) {
    var images = _.map(result.data, function(o) {
      return { id: o.id, url: o.images.low_resolution.url };
    });

    // preload images
    _(images).each(function(el) {
      imageList.add(el);
      $('<img />').attr('src', el.url).appendTo('#preload').css('display','none');
    });
  });
}

function showImage(image) {
  var $image = $('<div class="image"><img src="' + image.url + '" /></div>');

  // randomize side to throw from

  var side = Math.floor(Math.random() * 4);

  switch (side) {
    case 0: // top
      $image.css({ top: options.imageLength * -1, left: randomX() });
      break;
    case 1: // right
      $image.css({ top: randomY(), left: window.innerWidth });
      break;
    case 2: // bottom
      $image.css({ top: window.innerHeight, left: randomX() });
      break;
    case 3: // left
      $image.css({ top: randomY(), left: options.imageLength * -1 });
      break;
  }

  $('#board').append($image);

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
    $image.css({ rotate: 180 });
  }

  var left = randomX();
  var top = randomY();

  $image
    .transition({ left: left, top: top, rotate: rotate, easing: 'snap', duration: 1500 })
    .transition({ opacity: 0, delay: options.fadeDelayMS }, options.fadeOutMS, 'in', function() {
      this.remove();
    });
}

function randomX() {
  return Math.floor(Math.random() * (window.innerWidth - options.imageLength));
}

function randomY() {
  return Math.floor(Math.random() * (window.innerHeight - options.imageLength));
}
