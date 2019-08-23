const excelToJson = require('convert-excel-to-json')

global.__basedir = __dirname;

module.exports = (file) => {
  return excelToJson({
    sourceFile: __basedir + '/excelTmp/' + file.filename,
    header : {
      rows: 1
    },
    sheets: [{
      name: 'Employees',
      columnToKey: {
        A: 'name',
        B: 'address',
        C: 'phone',
        D: 'department',
        E: 'email'
      }
    }]
  })
}