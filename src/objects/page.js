'use strict';

class Page {
  constructor(index, offset, data, total) {
    this.index = index;
    this.offset = offset;
    this.data = data;
    this.total = total;
  }
}

module.exports = Page;
