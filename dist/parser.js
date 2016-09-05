"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var convertSimpleString = function convertSimpleString() {
  var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
  var destUnit = arguments[1];

  try {
    var pattern = /([\d.]+)\s*([A-Za-z"']+)/;

    var _ref = string.match(pattern) || [];

    var _ref2 = _slicedToArray(_ref, 3);

    var s = _ref2[0];
    var value = _ref2[1];
    var unit = _ref2[2];

    return convert(value).from(unit).to(destUnit);
  } catch (e) {
    return undefined;
  }
};

var convertCompositeString = function convertCompositeString() {
  var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
  var destUnit = arguments[1];


  var pattern = /([\d.]+\s*[A-Za-z"']+)+/g;
  var results = string.match(pattern) || [];

  return results.map(function (s) {
    return convertSimpleString(s);
  }) //convert each number+unit pair
  .reduce(function (total, v) {
    return total + v;
  }, 0); // get sum of all values}
};

var getBmi = function getBmi(heightString, weightString) {

  var height = convertCompositeString(heightString, 'm');
  var weight = convertCompositeString(weightString, 'm');

  return getBmiFromSi(height, weight);
};

exports.default = getBmi;