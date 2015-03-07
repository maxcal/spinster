'use strict';

describe('Spinster', function(){

    before(function(){

       $('body').append(window.__html__['spec/fixtures/spinster.html']);

       this.fixture = $('.spinster');
       this.spinster = new Spinster(this.fixture);
       this.element = this.spinster.getElement();
    });

    it('has a test suite', function(){
        return expect(Spinster).to.be.defined;
    });

    describe("initialization", function(){
        it("is initializable", function(){
            expect(new Spinster()).to.be.an.instanceOf(Spinster);
        });
    });

    describe('slide', function(){

    });
});