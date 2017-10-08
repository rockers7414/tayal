'use strict';

class InvalidParam {
  constructor(params = []) {
    this.status = 400;
    this.err_msg = 'The parameter is invalid.';
    this.params = params;
  }
}

module.exports = {
  InvalidParam: InvalidParam
};
