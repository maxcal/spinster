define(['jquery', 'underscore'], function($, _){

    /**
     *
     * @param $element
     * @constructor
     */
    function Spinster($element){

        var self = this;
        var $el = $element ||  $({});
        var events = self.events = {
            change: 'Spinster.change',
            initialize: 'Spinster.initialize',
            setActive: 'Spinster.setActive',
            change: 'Spinster.change',
            resize: 'Spinster.resize',
            scroll: 'Spinster.scoll',
            transition: {
                start: 'Spinster.transition.start',
                end: 'Spinster.transition.end'
            }
        };

        var options = {
            css3: true,
            items: '.spinster-item',
        }

        self.$el = $el;

        self.getItems = function(){
            return $el.find(options.items);
        };

        self.getActive = function(){
            return self.getItems().filter('.active');
        };
        /**
         * This is a "hard-wired" way to change panes which does not cause any animation.
         * @return this
         */
        self.setActive = function($target){
            var $old = self.getActive();
            $el.trigger(events.setActive, [$target, $old]);
            $old.removeClass('active');
            $target.addClass('active');
            $el.trigger(events.resize, [$target]);
            return self;
        };

        self.init = function(){
            var def = $.Deferred();
            var $target;

            goToHash(window.location.hash);

            $el.trigger('Spinster.initialize');
            return def.resolve();
        };

        function goToHash(hash, animate){
            if (hash.length && $(hash).length) {
                if (animate) {
                    self.change($(hash));
                } else {
                    self.setActive($(hash));
                }
            }
        }

        function transition($target, $old, direction) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                fadeInClass,
                fadeOutClass,
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

            $el.trigger(events.transition.start, [$target, $old, direction]);

            $el.trigger(events.scroll, [$target]);

            // Starts the animation
            $target.addClass('animated').addClass(fadeInClass);
            $old.addClass('animated').addClass(fadeOutClass);

            $target.one(animationEnd, function(){
                $target.addClass('active');
                targetAnim.resolve();
            });
            $old.one(animationEnd, function(){
                $old.removeClass('active');
                oldAnim.resolve();
            });

            animating.done(function(){
                self.getItems().removeClass('slideInLeft slideOutLeft slideOutRight slideInRight animated');
            });
            return animating;

        }

        function transitionFallback($target, $old, direction) {
            // we don't really have any animation yet but we return a promise
            // so that the API is consistent.
            var def = $.Deferred();
            self.setActive($target);
            return def.resolve();
        }

        /**
         * Switch between items
         */
        self.change = function($target){
            var $old = self.getActive();
            var direction = $target.index() < $old.index() ? 'back' : 'forward';
            var def = $.Deferred();
            var trans;

            // bail if target is already active
            if ($target.is($old)) return def.resolve($target);

            self.$el.trigger(events.change, [$target, $old, direction]);

            if (options.css3){
                trans = transition($target, $old, direction);
            } else {
                trans = transitionFallback($target, $old, direction);
            }

            // When the animation is done
            trans.done(function(){
                def.resolve($target);
                $el.trigger(events.transition.end, [$target, $old, direction]);
                // trigger resize
                $el.trigger(events.resize, [$target]);

            });

            return def;
        };

        self.back = function(){
            var target = self.getActive().prev(options.items);
            if ( !target.length ) {
                target = self.getItems().last();
            }
            return self.change(target);
        };

        self.next = function(){
            var target = self.getActive().next(options.items);
            if ( !target.length ) {
                target = self.getItems().first();
            }
            return self.change(target);
        }

        $el.on(events.resize, function(e, $target){
            $target = $target || self.getActive();
            $el.css('min-height', $target.outerHeight());
        });

        $el.on(events.scroll, function(e, $target){
            $target = $target || self.getActive();
            $('body, html').animate({
                'scrollTop': $target.offset().top - 100
            }, 300)
        });

        $(window).resize(_.throttle(function(){
            self.$el.trigger(events.resize, [self.getActive()]);
        }, 20));

        $el.on('click', '.spinster-target', function(e){
            if (window.history && window.history.pushState) {
                var href = $(this).attr('href');
                window.history.pushState({}, "", href);
                goToHash(href, true);
            } else {
                window.location.hash = href;
            }
            return false;
        });

        $el.on('click', '.spinster-back', function(e){
            self.back().done(function(target){
                var href = '#' + target.attr('id');
                if (window.history && window.history.pushState) {
                    window.history.pushState({}, "", href);
                } else {
                    window.location.hash = href;
                }
            });
            return false;
        });

        $(window).on('hashchange', function(){
            var hash = window.location.hash;
            if (hash.length) {
                goToHash(hash, true);
            } else {
                self.change(self.getItems().first());
            }
        });
    };

    return Spinster;
});