// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage({ projectId: 'hacktiv8-244310', keyFilename: './keyfile.json' });

const Company = require('../models/companies')
const Employee = require('../models/employees')

module.exports = {
	deleteAllCompany: async () => {
		await Company.deleteMany()
	},
	createCompany: async () => {
		const company = await Company.create({
			email: 'company@mail.com',
			name: 'company',
			password: '12345678'
		})
		
	},
	deleteFile: async (filename) => {
		console.log('filename: ', filename);
		await storage
			.bucket('nfcard-bucket')
			.file(filename)
			.delete();

		console.log(`gs://nfcard-bucket/${filename} deleted.`);
	},
	deleteAllEmployees: async () => {
		await Employee.deleteMany()
	},
	createEmployee: async () => {
		const newEmp = await Employee.create({
			email : 'nfcard@mail.com',
			password : 'password',
			name : 'nfcard',
			phone : '10012030123123',
			address : 'meme'
		})
	}
}