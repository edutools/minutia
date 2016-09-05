import { units, abbreviations, families } from './definitions'

const parseSimpleString = (string) => {

  // match will give an array of capturing parentheses
  // (we have to discard first element because it's the whole string)
  const pattern = /([\d.]+)\s*([A-Za-z"']+)/
  let [,value, abbr] = string.match(pattern)

  value = value || NaN

  return {value, abbr}

}

const parseUnitString = (string="") => {

  // match will return an array of matches due to 'g' flag
  const pattern = /([\d.]+\s*[A-Za-z"']+)+/g
  const results = string.match(pattern)

  if (!results)
    return [NaN]

  return results.map(s => parseSimpleString(s)) //convert each number+unit pair

}

const getNativeUnit = ({value, abbr}) => {

  // use the prefix map to lookup the prefix
  const unitName = abbreviations.get(abbr)
  // lookup the unit info in the units db
  const unitType = units.getIn([unitName, 'family'])
  const unitFactor = units.getIn([unitName, 'factor'])
  // calculate the native value using the conversion factor
  const nativeValue = value * unitFactor

  return {
    value: nativeValue,
    kind: unitType
  }

}

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
const sumUnits = (unitA, unitB) => {

  // sum the two values together
  const value = unitA.value + unitB.value

  // merge remaining values
  return Object.assign({}, unitA, unitB, {value})

}

const Minutia = function(unitString) {

  if (! (this instanceof Minutia))
    return new Minutia(unitString)

  // parse the unit string and convert it into a "native value"
  const nativeUnit = parseUnitString(unitString)
                       .map(getNativeUnit)
                       .reduce(sumUnits)

  this.kind  = nativeUnit.kind  // save the kind
  this.value = nativeUnit.value // save the native value

  return this

}

Minutia.prototype.to = function(destUnit) {

  // get the real name of the unit from the abbreviation
  const realName = abbreviations.get(destUnit.trim())

  console.log(realName, this)

  // make sure the conversion is within the same family
  if (units.getIn([realName, 'family']) !== this.kind )
    return NaN

  // divide by the factor since we're going in the reverse direction
  return this.value / units.getIn([realName, 'factor'])

}

export default Minutia
module.exports = Minutia

if ((process.argv[2] === 'test') && (require.main === module)) {
  console.log(Minutia('5kg 5g').to('lbs'))
  console.log(Minutia('5ft 10"').to('m'))
}
