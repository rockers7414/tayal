'use strict';

class Response {
  constructor(data, error) {
    this.data = data;
    this.error = error;
  }
}

class Collection extends Response {
  constructor(data, index, offset, total) {
    super(data, null);

    this.type = 'collection';
    this.index = index;
    this.offset = offset;
    this.total = total;
  }
}

class Data extends Response {
  constructor(data, error = null) {
    super(data, error);

    this.type = 'single';
  }
}

class Error extends Response {
  constructor(error) {
    super(null, error);
  }
}

module.exports = {
  Data: Data,
  Collection: Collection,
  Error: Error
};
