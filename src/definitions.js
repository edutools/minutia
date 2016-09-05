import I from 'immutable'

const sourceData = I.fromJS({
  mass: {
    units: {
      microgram: {
        factor: 1/1000000,
        abbr: ['mcg', 'µg']
      },
      miligram: {
        factor: 1/1000,
        abbr: ['mg']
      },
      gram: {
        factor: 1,
        abbr: ['g']
      },
      decagram: {
        factor: 10,
        abbr: ['dag']
      },
      hectogram: {
        factor: 100,
        abbr: ['hg']
      },
      kilogram: {
        factor: 1000,
        abbr: ['kg']
      },
      pound: {
        factor: 453.592374,
        abbr: ['lb', 'lbs']
      },
      ounce: {
        factor: 28.3495231,
        abbr: ['oz']
      }
    },
  },
  length: {
    units: {
      milimeter: {
        factor: 0.001,
        abbr: ['mm']
      },
      centimeter: {
        factor: 0.01,
        abbr: ['cm']
      },
      meter: {
        factor: 1,
        abbr: ['m']
      },
      foot: {
        factor: 0.3048,
        abbr: ['ft', "'"]
      },
      inch: {
        factor: 0.0253999998,
        abbr: ['in', '"']
      },
      yard: {
        factor: 0.914399999,
        abbr: ['yd', 'yds']
      }
    },
  },
})

// map to lookup info about a specific unit (for example, the conversion factor)
// basically we're "flattening" the sourceData array
const units = I.Map().withMutations(units => {

  // iterate over families
  sourceData.forEach((familyInfo, familyName) => {
    // iterate over units within family
    familyInfo.get('units').forEach((unitInfo, unitName) => {

      // extend the unitInfo to include the family name
      unitInfo = unitInfo.set('family', familyName)
      // add the unit to the units map
      units.set(unitName, unitInfo)

    })
  })

})

// for a given abbreviation, what is the corresponding unit?
const abbreviations = I.Map().withMutations(abbreviations => {

  // iterate all units
  units.forEach((unitInfo, unitName) => {
    // iterate over abbreviations within unit
    unitInfo.get('abbr').forEach((abbreviation) => {
      // add the abbreviation to the map
      abbreviations.set(abbreviation, unitName)
    })
    // add the unit name as another abbreviation
    abbreviations.set(unitName, unitName)
  })

})

// map to lookup info about a specific family
// (right now it's just a list of units in that family)
const families = sourceData.map((familyInfo, familyName) => {

  // the list of unit names within that family
  const units = I.Set(familyInfo.get('units').keySeq())

  // base or "native" unit
  const baseUnit = familyInfo.get('units').findKey(u => u.factor === 1)

  return I.Map({ units, baseUnit })
})

// es2015 modules export
export { units, abbreviations, families }
// compatibility with commonJs
export default { units, abbreviations, families }

if ((process.argv[2] === 'test') && (require.main === module)) {
  console.log('-----------------------------------------------')
  console.log(units.toJS())
  console.log('-----------------------------------------------')
  console.log(abbreviations.toJS())
  console.log('-----------------------------------------------')
  console.log(families.toJS())
  console.log('-----------------------------------------------')
}
