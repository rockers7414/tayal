'use strict';

/*** Parameters error ***/
class InvalidParam {
  constructor(params = []) {
    this.status = 40001;
    this.err_msg = 'The parameter is invalid.';
    this.params = params;
  }
}

class ResourceNotFound {
  constructor() {
    this.status = 40002;
    this.err_msg = 'Resource not found.';
  }
}

/*** Database errors ***/
class UnremovableError {
  constructor(reason) {
    this.status = 50001;
    this.err_msg = 'The entity is unremovable.(' + reason + ')';
  }
}

/*** Operation errors ***/
class IllegalOperationError {
  constructor(reason) {
    this.status = 60001;
    this.err_msg = 'Illegal operation.(' + reason + ')';
  }
}

module.exports = {
  ResourceNotFound: ResourceNotFound,
  InvalidParam: InvalidParam,
  UnremovableError: UnremovableError
};