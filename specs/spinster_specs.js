define(['spinster'], function(Spinster){

    describe('foo', function(){

        before(function(){
            this.subject = new Spinster($('#spinster'));
        });

        it('is initializable', function(){
            expect( this.subject ).to.be.an.instanceOf(Spinster);
        });
    });
});

