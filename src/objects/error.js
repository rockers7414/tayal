'use strict';

class InvalidParam {
  constructor(params = []) {
    this.status = 400;
    this.err_msg = 'The parameter is invalid.';
    this.params = params;
  }
}

class UnremovableError {
  constructor(reason) {
    this.status = 5000;
    this.err_msg = 'The entity is unremovable.(' + reason + ')';
  }
}

module.exports = {
  InvalidParam: InvalidParam,
  UnremovableError: UnremovableError
};
