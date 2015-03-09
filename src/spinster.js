(function(context){
    function Spinster(element, options){
        var self = this;
        var element = element || $('</div>');
        /**
         *
         * @type {{container: string, items: string, keys: {LEFT: number, RIGHT: number}}}
         */
        this.options = {
            animation: 'fade',
            container: '.spinster-container',
            items: '.spinster-item',
            keys: {
                LEFT: 37,
                RIGHT: 39
            }
        };

        $(window).on('keyup', function(e){
            switch(e.keyCode){
                case 37: // left
                    self.previous();
                    break;
                case 39: // right
                    self.next();
                    break;
            }
        });

        this.next = function(){
            var target = element.find('.active').next();
            if (target.length) pushState('#' + target.attr('id'));
            element.trigger('spinster.next', [target]);
        };
        this.previous = function(){
            var target = element.find('.active').prev();
            if (target.length) pushState('#' + target.attr('id'));
            element.trigger('spinster.previous', [target]);
        };

        function pushState(href){
            // Avoid scrolling to hash target
            if (window.history && window.history.pushState) {
                // Most browsers ignore the second title parameter - silly W3C
                window.history.pushState({ 'foo': 'bar' }, "", href);
                self.onHashChange();
            } else /** fallback **/ {
                window.location.hash = href;
            }
        }

        /**
         * Merges passed in options with defaults
         * @param options
         */
        this.config = function(options){
            this.options = $.extend(this.options, options || {});
        }

        function init(options){
            // Fill in the default
            self.config(options);

            // If there is a hash we try to match it to a element and activate that element.
            if (window.location.hash) {
                // nothing happens if jQuery does not find element.
                element.find(window.location.hash)
                        .addClass('active')
                        .siblings()
                            .removeClass('active');
            }

            // this a custom "animation cue"
            element.queue('hashchanges', []);

            // Prevent the browsers default behavior of scrolling to target
            element.on('click','.spinster-target', function(e){
                e.preventDefault();
                e.stopPropagation();
                pushState($(this).attr('href'));
            });

            // Bind an event listener for when user goes back and forward
            // Also for click events from browsers that do not support history.pushState
            window.addEventListener("hashchange", function(e){
                e.preventDefault();
                self.onHashChange();
            }, false);
        }
        /**
         *
         * @param target
         * @returns {Promise} Which indicates that both animations have finished.
         */
        this.slide = function(target){

            var old = element.find('.active'),
                animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                // Which direction are we going?
                direction = target.index() < old.index() ? 'back' : 'forward',
                fadeInClass,
                fadeOutClass,
                items = element.find(self.options.items),
                targetAnim = $.Deferred(),
                oldAnim = $.Deferred(),
                animating = $.when(targetAnim, oldAnim);

            switch (direction) {
                case 'back':
                    fadeInClass = 'slideInLeft';
                    fadeOutClass = 'slideOutRight';
                    break;
                case 'forward':
                    fadeInClass = 'slideInRight';
                    fadeOutClass = 'slideOutLeft';
                    break;
            }

            element.trigger('spinster.animation_start', [target]);

            // Starts the animation
            target.addClass('animated').addClass(fadeInClass);
            old.addClass('animated').addClass(fadeOutClass);

            target.one(animationEnd, function(){
                $(this).addClass('active');
                targetAnim.resolve();
            });
            old.one(animationEnd, function(){
                $(this).removeClass('active');
                oldAnim.resolve();
            });

            animating.done(function(){
               items.removeClass('slideInLeft slideOutLeft slideOutRight slideInRight animated');

            });

            animating.done(function(){
                element.trigger('spinster.animation_end', [target]);
            });

            return animating;
        }

        /**
         * @returns {*|jQuery|HTMLElement}
         */
        this.getElement = function(){
            return element;
        };

        this.onHashChange = function(){
            var id = window.location.hash;
            var target;
            var promise;
            var old = element.find(self.options.items).filter('.active');

            if (id.length) {
                target = element.find(id);
            } else {
                target = element.find(self.options.items).first();
            }

            // Browsers without CSS3 transitions get a jQuery animation
            if (!Modernizr.csstransitions) {
                element.trigger('spinster.animation_start', [target]);
                promise = fallbackAnimate(target, old);
                promise.done(function(){
                    element.trigger('spinster.animation_end', [target]);
                });
                return promise;
            }

            element.find(self.options.items).removeClass('slideInLeft slideOutLeft slideOutRight slideInRight animated');
            element.queue('hashchanges', function(next){
                var ct = target; // next animation in cue will change outer target variable.
                promise = self.slide(ct).done(function(){
                    next();
                });
            });

            element.dequeue( "hashchanges" );
            element.trigger('spinster.onHashChange', [target, promise]);

            return self;
        };

        /**
         * A fall back for browsers which do not support CSS3 transitions.
         * At the moment this does not animate at all.
         * @param $target
         * @param $old
         * @returns {*}
         */
        function fallbackAnimate($target, $old) {
            var promise = $.Deferred();
            $target.addClass('active');
            $old.removeClass('active');
            promise.resolve();
            return promise;

        }

        element.on('spinster.animation_start', function(e, target){
            element.css('minHeight', target.height() + 20);
            $('html,body').animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        });

        $(window).resize(_.throttle(function(){
            element.css('minHeight', element.find('.active').height());
        }, 20));

        // Initialize with the passed in options
        init(this.options);
    }

    context.Spinster = Spinster;
}(window));



