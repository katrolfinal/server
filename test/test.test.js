function summ (num1, num2){
    return num1+num2
}

const chai = require('chai'), chaiHttp = require('chai-http'),
    expect = chai.expect //to solve error when using done(): “ReferenceError: expect is not defined”
    ;



describe('testing fn summ', () => {
    it('should return 2', () => {
        expect(summ(1,1)).to.be.equal(2)
    })
})