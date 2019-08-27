const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const { createCompany, deleteAllCompany, deleteAllEmployees } = require('../helpers/testHelper')
const fs = require('fs')

let companyId
let token = {
  employee : '',
  company: ''
}
let employeeLogin
let contactId
let employeeAcc

let excelFile = fs.readFileSync(`${__dirname}/excel.xlsx`)
const image = fs.readFileSync('./test/image.png')

chai.use(chaiHttp)

describe('Employee testing' , function () {
  this.timeout(0)
  before(async () => {
    // await createCompany()
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
      employeeLogin = res.body[1]
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
      expect(res.body).to.have.property('_id')
      contactId = res.body._id
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
    it('should error when create single employee without email', async () => {
      const data ={ 
        name : 'jono',
        address : 'jono',
        phone: '02929292',
        position : 'satpam'
      }
      const res = await chai
        .request(app)
        .post('/api/employees/single')
        .set('token', token.company)
        .send(data)

      
      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.include('email is required');
    })

    it('should error when delete nonexistent employee - (code - 404)', async () => {
      const res = await chai
        .request(app)
        .delete('/api/employees/'+companyId)
        .set('token', token.company)
      
      expect(res).to.have.status(404)
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('employee not found !')
    })

    it('should error when update nonexistent employee - (code - 404)', async () => {
      const res = await chai
        .request(app)
        .put('/api/employees/'+companyId)
        .set('token', token.company)
        .send(employeeAcc)
      
      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('employee not found !')
    })
  })

  describe('for mobile', () => {
    it('should login employee - (code : 200)', async () => {
      
      const data = {
        email : employeeLogin.email,
        password : employeeLogin.password
      }
      const res = await chai
        .request(app)
        .post('/api/employees/login')
        .send(data)

  
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('token')
      expect(res.body).to.have.property('employee')
      token.employee = res.body.token
    });
    it('should error when login with wrong email / password - (code : 400)', async () => {
      const data = {
        email : 'awjaodjaidjw@mail.com',
        password : employeeAcc.password
      }

      const res = await chai
        .request(app)
        .post('/api/employees/login')
        .send(data)

      
      expect(res).to.have.status(400)
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('wrong email / password')
    })
    it('should get all employee list - (code : 200)', async () => {
      const res = await chai
        .request(app)
        .get('/api/employees/')
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
    })
    it('should get all company by company id - (code - 200)', async () => {
      const res = await chai
        .request(app)
        .get('/api/employees/byCompany/')
        .set('token', token.employee)

      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body[0].company).to.equal(companyId)
    })
    it('should upload image for employee - (code - 200)', async () => {
      const res = await chai
        .request(app)
        .put('/api/employees/uploadImage')
        .set('token', token.employee)
        .attach('image', image, 'image.png')
      
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('image')
    })
    it('should add to contact - (code - 200)', async () => {
      const res = await chai
        .request(app)
        .put('/api/employees/contacts/'+contactId)
        .set('token', token.employee)
      
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('contacts')
      expect(res.body.contacts).to.include(contactId)
    })
    it('should delete contact - (code - 200)', async () => {
      const res = await chai
        .request(app)
        .delete('/api/employees/contacts/'+contactId)
        .set('token', token.employee)
      
      
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('contacts')
      expect(res.body.contacts.includes(contactId)).to.equal(false)
    })
    it('should send error when add nonexistent employee - (code : 404)', async () => {
      const res = await chai
        .request(app)
        .put('/api/employees/contacts/d192912h98dn')
        .set('token', token.employee)
      
      
      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('employee not found !')
    })
    it('should send error when delete nonexistent employee - (code : 404)', async () => {
      const res = await chai
        .request(app)
        .delete('/api/employees/contacts/'+contactId)
        .set('token', token.employee)

      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('employee not found !')
    })
    it('should get single employee by id - (code : 200)', async () => {
      const res = await chai
        .request(app)
        .get('/api/employees/byId/'+contactId)
        .set('token', token.employee)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('company')
      expect(res.body).to.have.property('name')
      expect(res.body).to.have.property('email')
      expect(res.body).to.have.property('password')
    })
    it('should send error when find nonexistent id - (code : 404)', async () => {
      const res = await chai
        .request(app)
        .get('/api/employees/byId/'+employeeAcc._id)
        .set('token', token.employee)

      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('errors')
      expect(res.body.errors).to.include('employee not found !')
    })
  })
})