function showImage(imageUrl) {
  var $image = $('<div class="image"><img src="' + imageUrl + '" /></div>');

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

  // cycle through images
  if (count == images.length - 1) {
    count = 0;
  } else {
    count++;
  }
}

function randomX() {
  return Math.floor(Math.random() * (window.innerWidth - options.imageLength));
}

function randomY() {
  return Math.floor(Math.random() * (window.innerHeight - options.imageLength));
}
