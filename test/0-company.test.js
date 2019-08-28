const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const {deleteAllCompany, createCompany, deleteFile} = require('../helpers/testHelper')
const expect = chai.expect;
chai.use(chaiHttp);

const image = require('fs').readFileSync('./test/image.png')
let fileBucket = null

let token
let companyAcc


describe('company', function() {
    before(async () => {
        await createCompany()
        console.log('company created')
    })
    
    after(async () => {
        await deleteAllCompany()
        await deleteFile(fileBucket)
        console.log('company deleted')
    })

    describe('success case', function() {
        this.timeout(0)
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
                    .field('color', 'black')
                    .attach('image', image, 'image.png')
                    .end((err, response) => {
                        fileBucket = "image.png"
                        expect(response).to.have.status(201)
                        expect(response.body).to.be.an('object')
                        expect(response.body).to.have.property('email')
                        expect(response.body).to.have.property('name')
                        expect(response.body).to.have.property('password')
                        expect(response.body).to.have.property('logo')
                        expect(response.body).to.have.property('color')
                        companyAcc = response.body
                        
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
                        token = response.body.token
                        done()
                    })
                    .catch(err => {
                        console.log('err: ', err);
                    })
            })
        })
        describe('PUT, update company', () => {
            it('should update company with token - (code : 200)', async () => {
                
                companyAcc.color = 'white'
                const res = await chai
                    .request(app)
                    .put('/api/company')
                    .set('token', token)
                    .send(companyAcc)
    
                
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
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
        describe('Error register email already used', () => {
            it('should return error, with status code (400)', async () => {
                const response = await chai
                    .request(app)
                    .post('/api/company/register')
                    .send({
                        email : 'companies@mail.com',
                        password : '12345679',
                        image: 'image.jpg',
                        name: 'companyy'
                    })
                
                
                expect(response.status).to.be.equal(400)
                expect(response.body).to.have.property('errors')
            })
            it('should error when creating invalid email - (code : 400)', async () => {
                const response = await chai
                    .request(app)
                    .post('/api/company/register')
                    .send({
                        email : 'mantul',
                        password : '12345679',
                        image: 'image.jpg',
                        name: 'companyy'
                    })
                
                expect(response).to.have.status(400)
                expect(response.body).to.be.an('object')
                expect(response.body).to.have.property('errors')
                expect(response.body.errors).to.include('invalid email !')
            })
        })
    })
})