define(['spinster'], function(Spinster){

    describe('Spinster', function(){

        var spec = this;
        var events;
        var $el;

        before(function(){
            this.subject = new Spinster($('#spinster'));
            events = this.subject.events;

        });

        beforeEach(function(){
            window.location.hash = '';
            this.subject.setActive($('#one'));
            $('html').addClass('csstransitions'); // mocks Modernizer
        });

        it('is initializable', function(){
            expect( this.subject ).to.be.an.instanceOf(Spinster);
        });

        describe('.init', function(){
            it('fires an init event', function(done){

                var triggered = false;

                this.subject.$el.on('Spinster.initialize', function(){
                    triggered = true;
                    done();
                });
                this.subject.init();
                expect(triggered).to.be.true;


            });
            it('activates the correct element when there is a hash', function(done){
                window.location.hash = 'two';
                this.subject.init().done(function(){
                    expect($('#two').hasClass('active')).to.be.true;
                    done();
                });
            });
        });

        describe('.setActive', function(){
            it('triggers a setActive event', function(){
                var triggered = false;
                this.subject.$el.on('Spinster.setActive', function(){
                    triggered = true;
                });
                this.subject.setActive($('#two'));
                expect(triggered).to.be.true;
            });
            it('activates the element', function(){
                this.subject.setActive($('#two'));
                expect(this.subject.getActive().attr('id')).to.eq('two');
            });
            it('triggers a resize', function(){
                this.subject.setActive($('#two'));
                expect(this.subject.$el.height()).to.be.at.least(this.subject.getActive().height());
            });
        });

        describe('.change', function(){
            it('triggers a change event', function(){
                var dir;
                this.subject.$el.on(events.change, function(e, t,o, direction){
                    dir = direction;
                });
                this.subject.change($('#two'));
                expect(dir).to.eq('forward');
            });

            it('activates the correct item', function(done){
                this.subject.change($('#two')).done(function(t){
                    expect(t.hasClass('active')).to.be.true;
                    done();
                });
            });

            it('triggers a resize', function(done){
                this.subject.change($('#two')).done(function(val){
                    done();
                });
                expect(this.subject.$el.height()).to.be.at.least(this.subject.getActive().height());
            });
        });

        describe('.back', function(){
            it('activates the previous item', function(done){
                this.subject.setActive($('#three'));
                this.subject.back().done(function(target){
                    expect(target.attr('id')).to.equal('two');
                    done();
                });
            });

            it('loops around', function(done){
                this.subject.setActive($('#one'));
                this.subject.back().done(function(target){
                    expect(target.attr('id')).to.equal('four');
                    done();
                });
            });

        });

        describe('.next', function(){
            it('activates the next item', function(done){
                this.subject.setActive($('#one'));
                this.subject.next().done(function(target){
                    expect(target.attr('id')).to.equal('two');
                    done();
                });
            });

            it('loops around', function(done){
                this.subject.setActive($('#four'));
                this.subject.next().done(function(target){
                    expect(target.attr('id')).to.equal('one');
                    done();
                });
            });
        });

        describe('events', function(){

            it("reacts to window resize", function(done){
                var events = this.subject.events;
                var $el = this.subject.$el;

                this.subject.setActive($('#four'));
                this.subject.$el.on(events.resize, function(e, target){
                    expect($el.height())
                        .to.be.at.least(target.height());
                    done();
                });
                this.subject.init();
                $(window).trigger('resize');
            });

            it("reacts when user clicks target buttons", function(done){
                var $link = $('#one .spinster-target');

                $link.click();
                this.subject.$el.on(events.transition.end, function(e, target){
                    expect(target.attr('id')).to.equal('two');
                    done();
                });
            });

            it("reacts when user clicks back button", function(){
                var $button = $('#three .spinster-back');

                $button.click();
                this.subject.$el.on(events.transition.end, function(e, target){
                    expect(target.attr('id')).to.equal('two');
                    done();
                });
            });
        });
    });
});

