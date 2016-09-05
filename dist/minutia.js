'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _definitions = require('./definitions');

var parseSimpleString = function parseSimpleString(string) {

  // match will give an array of capturing parentheses
  // (we have to discard first element because it's the whole string)
  var pattern = /([\d.]+)\s*([A-Za-z"']+)/;

  var _string$match = string.match(pattern);

  var _string$match2 = _slicedToArray(_string$match, 3);

  var value = _string$match2[1];
  var abbr = _string$match2[2];


  value = value || NaN;

  return { value: value, abbr: abbr };
};

var parseUnitString = function parseUnitString() {
  var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];


  // match will return an array of matches due to 'g' flag
  var pattern = /([\d.]+\s*[A-Za-z"']+)+/g;
  var results = string.match(pattern);

  if (!results) return [NaN];

  return results.map(function (s) {
    return parseSimpleString(s);
  }); //convert each number+unit pair
};

var getNativeUnit = function getNativeUnit(_ref) {
  var value = _ref.value;
  var abbr = _ref.abbr;


  // use the prefix map to lookup the prefix
  var unitName = _definitions.abbreviations.get(abbr);
  // lookup the unit info in the units db
  var unitType = _definitions.units.getIn([unitName, 'family']);
  var unitFactor = _definitions.units.getIn([unitName, 'factor']);
  // calculate the native value using the conversion factor
  var nativeValue = value * unitFactor;

  return {
    value: nativeValue,
    kind: unitType
  };
};

// const getDirectFactor = (unitA, unitB) => {
//
//   // lazy evaluation
//   const direct = () => units.getIn([unitA, 'factor']) / units.getIn([unitB, 'factor'])
//   const sloppy = () => equivelants.getIn(unitA, unitB, 'factor')
//
//   // note that "sloppy"
//
//   return direct() || sloppy() || NaN
//
// }

// requires native units
var sumUnits = function sumUnits(unitA, unitB) {

  // sum the two values together
  var value = unitA.value + unitB.value;

  // merge remaining values
  return Object.assign({}, unitA, unitB, { value: value });
};

var Minutia = function Minutia(unitString) {

  if (!(this instanceof Minutia)) return new Minutia(unitString);

  // parse the unit string and convert it into a "native value"
  var nativeUnit = parseUnitString(unitString).map(getNativeUnit).reduce(sumUnits);

  this.kind = nativeUnit.kind; // save the kind
  this.value = nativeUnit.value; // save the native value

  return this;
};

Minutia.prototype.to = function (destUnit) {

  // get the real name of the unit from the abbreviation
  var realName = _definitions.abbreviations.get(destUnit.trim());

  console.log(realName, this);

  // make sure the conversion is within the same family
  if (_definitions.units.getIn([realName, 'family']) !== this.kind) return NaN;

  // divide by the factor since we're going in the reverse direction
  return this.value / _definitions.units.getIn([realName, 'factor']);
};

exports.default = Minutia;

module.exports = Minutia;

if (process.argv[2] === 'test' && require.main === module) {
  console.log(Minutia('5kg 5g').to('lbs'));
  console.log(Minutia('5ft 10"').to('m'));
}