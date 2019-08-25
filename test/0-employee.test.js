const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const { createCompany, deleteAllCompany, deleteAllEmployees } = require('../helpers/testHelper')
const fs = require('fs')

let companyId
let token = {
  emplooyee : '',
  company: ''
}
let employeeAcc
console.log(__dirname)
let excelFile = fs.readFileSync(`${__dirname}/excel.xlsx`)

chai.use(chaiHttp)

describe.only('Crud employees for company' , () => {
  before(async () => {
    await createCompany()
    console.log('company created')
  })

  after(async () => {
    await deleteAllCompany()
    await deleteAllEmployees()
    console.log('database cleared')
  })
  it('should return token & company data', (done) => {
    chai
      .request(app)
      .post('/api/company/login')
      .send({
        email : 'company@mail.com',
        password : '12345678'
      })
      .then(response => {
        expect(response).to.have.status(200)
        expect(response.body).to.have.property('token')
        expect(response.body).to.have.property('company')
        token.company = response.body.token
        companyId = response.body.company._id
        done()
      })
      .catch(err => {
        console.log('err: ', err);
      })
  })

  describe('crud employee for company', () =>  {
    it('should create bulk employee with excel upload', async () => {
      const res = await chai
        .request(app)
        .post('/api/employees')
        .set('token', token.company)
        .attach('file', excelFile, 'excel.xlsx')
      
      expect(res).to.have.status(201)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.equal(4)
      expect(res.body[0]).to.have.property('company')
      expect(res.body[0]).to.have.property('name')
      expect(res.body[0]).to.have.property('email')
      expect(res.body[0]).to.have.property('password')
      expect(res.body[0].company).to.equal(companyId)
      employeeAcc = res.body[0]
    });

    it('should error when sending without excel file - (code - 400)', async () => {
      const res = await chai
        .request(app)
        .post('/api/employees')
        .set('token', token.company)
      
      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.include('No file');
    })

    it('should error when sending without token - (code : 400)', async () => {
      const res = await chai
        .request(app)
        .post('/api/employees')
        .attach('file', excelFile, 'excel.xslx')
      
      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.include('you must login first');
    })

    it('should update an employee name - (code : 200)', async () => {
      employeeAcc.name = 'ahsiap'
      const res = await chai
        .request(app)
        .put('/api/employees/'+employeeAcc._id)
        .set('token', token.company)
        .send(employeeAcc)
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('nModified')
      expect(res.body).to.have.property('ok')
      expect(res.body.nModified).to.equal(1)
      expect(res.body.ok).to.equal(1)
      
    });
    it('should update an employee address - (code : 200)', async () => {
      employeeAcc.address = 'ahsiap'
      const res = await chai
        .request(app)
        .put('/api/employees/'+employeeAcc._id)
        .set('token', token.company)
        .send(employeeAcc)
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('nModified')
      expect(res.body).to.have.property('ok')
      expect(res.body.nModified).to.equal(1)
      expect(res.body.ok).to.equal(1)
    });
    it('should update an employee phone - (code : 200)', async () => {
      employeeAcc.phone = '012301031023'
      const res = await chai
        .request(app)
        .put('/api/employees/'+employeeAcc._id)
        .set('token', token.company)
        .send(employeeAcc)
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('nModified')
      expect(res.body).to.have.property('ok')
      expect(res.body.nModified).to.equal(1)
      expect(res.body.ok).to.equal(1)
      
    });
    it('should update an employee position - (code : 200)', async () => {
      employeeAcc.position = 'ahsiap'
      const res = await chai
        .request(app)
        .put('/api/employees/'+employeeAcc._id)
        .set('token', token.company)
        .send(employeeAcc)
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('nModified')
      expect(res.body).to.have.property('ok')
      expect(res.body.nModified).to.equal(1)
      expect(res.body.ok).to.equal(1)
    });

    it('should error when update with without token - (code: 400)', async () => {
      const res = await chai
        .request(app)
        .put('/api/employees/'+employeeAcc._id)
        .send(employeeAcc)
      
      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('you must login first')
    })

    it('should delete an employee - (code : 200)', async () => {
      const res = await chai
        .request(app)
        .delete('/api/employees/'+employeeAcc._id)
        .set('token', token.company)
      
      expect(res).to.have.status(200)
    })

    it('should create one employee', async () => {
      const data ={ 
        name : 'jono',
        address : 'jono',
        phone: '02929292',
        email : 'jono@mail.com',
        position : 'satpam'
      }
      const res = await chai 
        .request(app)
        .post('/api/employees/single')
        .set('token', token.company)
        .send(data)

      expect(res).to.have.status(201)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('name')
      expect(res.body).to.have.property('address')
      expect(res.body).to.have.property('phone')
      expect(res.body).to.have.property('position')
      expect(res.body).to.have.property('email')
      expect(res.body).to.have.property('password')
      expect(res.body.name).to.equal(data.name)
      expect(res.body.address).to.equal(data.address)
      expect(res.body.phone).to.equal(data.phone)
      expect(res.body.position).to.equal(data.position)
      expect(res.body.email).to.equal(data.email)
    })
    it('should error when create single employee without token', async () => {
      const data ={ 
        name : 'jono',
        address : 'jono',
        phone: '02929292',
        email : 'jono@mail.com',
        position : 'satpam'
      }
      const res = await chai
        .request(app)
        .post('/api/employees/single')
        .send(data)
      
      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.include('you must login first');
    })
  })
})