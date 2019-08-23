const fs = require('fs');
const multer = require('multer');
const express = require('express');

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const excelToJson = require('convert-excel-to-json');
 
const app = express();
 
global.__basedir = __dirname;
 
// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});
 
const upload = multer({storage: storage});
 
// -> Express Upload RestAPIs
app.post('/api/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MongoDB(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});
 
// -> Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Customers',
 
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
			
            // Mapping columns to keys
            columnToKey: {
                A: '_id',
                B: 'name',
                C: 'address',
                D: 'age'
            }
        }]
    });
 
    // -> Log Excel Data to Console
    console.log(excelData);
 
    /**
    { 
        Customers:
        [ 
            { _id: 1, name: 'Jack Smith', address: 'Massachusetts', age: 23 },
            { _id: 2, name: 'Adam Johnson', address: 'New York', age: 27 },
            { _id: 3, name: 'Katherin Carter', address: 'Washington DC', age: 26 },
            { _id: 4, name: 'Jack London', address: 'Nevada', age: 33 },
            { _id: 5, name: 'Jason Bourne', address: 'California', age: 36 } 
        ] 
    }
    */	

    // Insert Json-Object to MongoDB
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        let dbo = db.db("gkzdb");
        dbo.collection("customers").insertMany(excelData.Customers, (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            /**
                Number of documents inserted: 5
            */
            db.close();
        });
    });
			
    fs.unlinkSync(filePath);
}
 
// Create a Server
let server = app.listen(8080, function () {
 
  let host = server.address().address;
  let port = server.address().port;
 
  console.log("App listening at http://%s:%s", host, port);
})