const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const {deleteAllCompany, createCompany, deleteFile} = require('../helpers/testHelper')
const expect = chai.expect;
chai.use(chaiHttp);

const image = require('fs').readFileSync('./test/image.png')
let fileBucket = null


describe('success case', function() {
    this.timeout(0)
    before(async () => {
        await createCompany()
        console.log('company created')
    })
    
    after(async () => {
        await deleteAllCompany()
        await deleteFile(fileBucket)
    })
    describe('GET, company', () => {
        it('should get all companies', function (done) {
            chai
                .request(app)
                    .get('/api/company')
                    .then(response => {  
                        expect(response.body).to.not.equal(null)
                        done()
                    })
        })
    })

    describe('POST, register company', () => {
        it('should register new company', function (done){
            chai   
                .request(app)
                .post('/api/company/register')
                .field('email', 'companies@mail.com')
                .field('name', 'company_irsantyo')
                .field('password', '12345678')
                .attach('image', image, 'image.png')
                .end((err, response) => {
                    fileBucket = "image.png"
                    expect(response).to.have.status(201)
                    done()
                })
        })
    })
    describe('POST register without file image', () => {
        it('should return status code (201)', (done) => {
            chai
                .request(app)
                .post('/api/company/register')
                .send({
                    email : 'companyy@mail.com',
                    password : '12345679',
                    name: 'companyy'
                })
                .then(response => {
                    expect(response.status).to.be.equal(201)
                    done()
                })
        })
    })
    describe('POST, login company', () => {
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
                    done()
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        })
    })
})

describe('error case', () => {
    describe('Error login wrong email', () => {
        it('should return error, with status code (404)', (done) => {
            chai
                .request(app)
                .post('/api/company/login')
                .send({
                    email : 'advnsd@mail.com',
                    password : '12345678'
                })
                .then(response => {
                    expect(response.body).to.have.property('errors')
                    expect(response.status).to.be.equal(404)
                    done()
                })
        })
    })
    describe('Error login wrong password', () => {
        it('should return error, with status code (404)', (done) => {
            chai
                .request(app)
                .post('/api/company/login')
                .send({
                    email : 'company@mail.com',
                    password : '12345679'
                })
                .then(response => {
                    expect(response.body).to.have.property('errors')
                    expect(response.status).to.be.equal(404)
                    done()
                })
        })
    })
    describe.skip('Error register email already used', () => {
        it('should return error, with status code (400)', (done) => {
            chai
                .request(app)
                .post('/api/company/register')
                .send({
                    email : 'company@mail.com',
                    password : '12345679',
                    image: 'image.jpg',
                    name: 'companyy'
                })
                .then(response => {
                    expect(response.body).to.have.property('errors')
                    expect(response.status).to.be.equal(400)
                    done()
                })
        })
    })
})