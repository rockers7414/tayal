'use strict';
const ObjectID = require('mongodb').ObjectID;

class JsonUtils {

  static isSame(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  static isSameByKey(key, obj1, obj2) {
    return obj1[key].toString() === obj2[key].toString();
  }

  static areSame(...objs) {
    if (objs.length > 1) {
      for (var i = 1; i < objs.length; i++) {
        var tmpResult = JsonUtils.isSame(objs[i - 1], objs[i]);
        if (!tmpResult)
          return false;
      }
    }
    return true;
  }

  static areSameByKey(key, ...objs) {
    if (objs.length > 1) {
      for (var i = 1; i < objs.length; i++) {
        var tmpResult = JsonUtils.isSameByKey(key, objs[i - 1], objs[i]);
        if (!tmpResult)
          return false;
      }
    }
    return true;
  }

  static hasSame(obj, objArray) {
    var result = false;
    objArray.forEach(_obj => {
      if (JsonUtils.isSame(obj, _obj)) {
        result = true;
        return false;
      }
    });
    return result;
  }

  static hasSameByKey(key, obj, objArray) {
    var result = false;
    objArray.forEach(_obj => {
      if (JsonUtils.isSameByKey(key, obj, _obj)) {
        result = true;
        return false;
      }
    });
    return result;
  }

  static arrayDiff(originArray, targetArray) {
    var missing = [];
    var newObj = [];
    /** Find if missing */
    originArray.forEach(oriObj => {
      var hasSame = JsonUtils.hasSame(oriObj, targetArray);
      if (!hasSame) {
        missing.push(oriObj);
      }
    });

    /** Find if new obj */
    targetArray.forEach(tgObj => {
      var hasSame = JsonUtils.hasSame(tgObj, originArray);
      if (!hasSame) {
        newObj.push(tgObj);
      }
    });

    return {
      "missing": missing,
      "newObj": newObj
    }
  }

  static arrayDiffByKey(key, originArray, targetArray) {
    var missing = [];
    var newObj = [];
    /** Find if missing */
    originArray.forEach(oriObj => {
      var hasSame = JsonUtils.hasSameByKey(key, oriObj, targetArray);
      if (!hasSame) {
        missing.push(oriObj);
      }
    });

    /** Find if new obj */
    targetArray.forEach(tgObj => {
      var hasSame = JsonUtils.hasSameByKey(key, tgObj, originArray);
      if (!hasSame) {
        newObj.push(tgObj);
      }
    });

    return {
      "missing": missing,
      "newObj": newObj
    }
  }

  static removeFromArray(targetObj, objArray) {
    for (var index = 0; index < objArray.length; index++) {
      if (JsonUtils.isSame(targetObj, objArray[index])) {
        objArray.splice(index, 1);
        index--;
      }
    }
  }

  static removeFromArrayByKey(key, targetObj, objArray) {
    for (var index = 0; index < objArray.length; index++) {
      if (JsonUtils.isSameByKey(key, targetObj, objArray[index])) {
        objArray.splice(index, 1);
        index--;
      }
    }
  }
}

module.exports = JsonUtils;