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

var FEED_TYPES = {
  FEED: 1,
  POPULAR: 2
};
