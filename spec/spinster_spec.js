'use strict';

describe('Spinster', function(){

    before(function(){
       this.fixture = $(window.__html__['spec/fixtures/spinster.html']);
       this.spinster = new Spinster(this.fixture);
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
            return expect(this.spinster.getElement().find('#two').hasClass('active')).to.be.true;
        });

        it("deactivates the old frame", function(){
            this.spinster.go("#two");
            return expect(this.spinster.getElement().find('.active').length).to.equal(1);

        });
    });

    it("listens for hashChange events", function(){
        window.location.hash = 'four';
        return expect(this.spinster.getElement().find('.active').attr('id')).to.equal('four');
    });
});