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

    describe('go', function(){
        it("activates target section", function(){
            this.spinster.go("#two");
            return expect(this.element.find('#two').hasClass('active')).to.be.true;
        });

        it("deactivates the old frame", function(){
            this.spinster.go("#two");
            return expect(this.element.find('.active').length).to.equal(1);

        });
    });
});