import I from 'immutable'

const sloppyEquivelants = I.fromJS([
  {
    a: 'mass',
    b: 'weight',
    factor: 0.00022046226218
  }
])

const sourceData = I.fromJS({
  mass: {
    units: {
      microgram: {
        factor: 1000000,
        abbr: ['mcg', 'µg']
      },
      miligram: {
        factor: 1000,
        abbr: ['mg']
      },
      gram: {
        factor: 1,
        abbr: ['g']
      },
      decagram: {
        factor: 0.1,
        abbr: ['dag']
      },
      hectogram: {
        factor: 0.01,
        abbr: ['hg']
      },
      kilogram: {
        factor: 0.001,
        abbr: ['kg']
      },
    },
  },
  weight: {
    units: {
      pound: {
        factor: 1,
        abbr: ['lb']
      },
      ounce: {
        factor: 16,
        abbr: ['oz']
      },
    },
  },
  length: {
    units: {
      milimeter: {
        factor: 1000,
        abbr: ['mm']
      },
      centimeter: {
        factor: 100,
        abbr: ['cm']
      },
      meter: {
        factor: 1,
        abbr: ['m']
      },
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
  })

})

// map to lookup info about a specific family
// (right now it's just a list of units in that family)
const families = sourceData.map((familyInfo, familyName) => {
  // immutable array of keys (constructed from an iterator of keys)
  const units = I.Set(familyInfo.get('units').keySeq())
  return I.Map({ units })
})

// es2015 modules export
export { units, abbreviations, families }
// compatibility with commonJs
export default { units, abbreviations, families }

if (process.argv[2] === 'test') {
  console.log('-----------------------------------------------')
  console.log(units.toJS())
  console.log('-----------------------------------------------')
  console.log(abbreviations.toJS())
  console.log('-----------------------------------------------')
  console.log(families.toJS())
  console.log('-----------------------------------------------')
}
