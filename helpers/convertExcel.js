const excelToJson = require('convert-excel-to-json')
const fs = require('fs')



module.exports = (filepath) => {
  return excelToJson({
    sourceFile: filepath,
    header: {
      rows: 1
    },
    columnToKey: {
      A: 'name',
      B: 'address',
      C: 'phone',
      D: 'position',
      E: 'email'
    }
  })
}