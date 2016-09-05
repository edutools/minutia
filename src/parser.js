const convertSimpleString = (string="", destUnit) => {
  try {
    const pattern = /([\d.]+)\s*([A-Za-z"']+)/
    const [s, value, unit] = string.match(pattern) || []
    return convert(value).from(unit).to(destUnit)
  }
  catch(e) {
    return undefined
  }
}

const convertCompositeString = (string="", destUnit) => {

  const pattern = /([\d.]+\s*[A-Za-z"']+)+/g
  const results = string.match(pattern) || []

  return results
           .map(s => convertSimpleString(s)) //convert each number+unit pair
           .reduce((total, v) => total + v, 0) // get sum of all values}

}

const getBmi = (heightString, weightString) => {

  const height = convertCompositeString(heightString, 'm')
  const weight = convertCompositeString(weightString, 'm')

  return getBmiFromSi(height, weight)

}

export default getBmi
