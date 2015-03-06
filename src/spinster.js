'use strict';
(function(context){

    function Spinster(element, options){

        var self = this;
        var element = element || $('</div>');


        /**
         *
         * @type {{container: string, items: string, keys: {LEFT: number, RIGHT: number}}}
         */
        this.options = {
            container: '.spinster-container',
            items: '.spinster-item',
            keys: {
                LEFT: 37,
                RIGHT: 39
            }
        };

        /**
         * Merges passed in options with defaults
         * @param options
         */
        this.config = function(options){
            this.options = $.extend(this.options, options || {});
        }

        function isAnimating(){
            var items =  element.find(self.options.items).filter('animating');
            return items.length !== 0;
        }

        function init(options){
            // Fill in the default
            self.config(options);

            window.addEventListener("hashchange", self.onHashChange, false);

            if (window.location.hash) {
                element.find(window.location.hash).addClass('active').siblings().removeClass('active');
            }

            // Prevent the browsers default behavior of scrolling to target
            element.on('click','.spinster-target', function(e){
                e.preventDefault();
                window.location.hash = $(this).attr('href').replace('#', '');
            });

        }

        /**
         * @param target string|jQuery
         */
        this.go = function(target, animate){
            target = target.jquery? target : element.find(target);


            self.slide(target).done(function(){
                // do this when we are finished animating.
            });
        };

        /**
         *
         * @param target
         * @returns {Promise} Which indicates that both animations have finished.
         */
        this.slide = function(target){

            var old = element.find('.active'),
                animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                direction,
                fadeInClass,
                fadeOutClass,
                items = element.find(self.options.items),
                newItemAnimationFinshed = $.Deferred(),
                oldItemAnimationFinished = $.Deferred(),
                animating = $.when(newItemAnimationFinshed, oldItemAnimationFinished);

            // Which direction are we going?
            direction = target.index() < old.index() ? 'back' : 'forward';


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

            target.addClass('animated').addClass(fadeInClass);
            old.addClass('animated').addClass(fadeOutClass);

            target.one(animationEnd, function(){
                $(this).addClass('active');
                newItemAnimationFinshed.resolve();
            });

            old.one(animationEnd, function(){
                oldItemAnimationFinished.resolve();
            });

            animating.done(function(){
               target.siblings().removeClass('active');
               items.removeClass('slideInLeft slideOutLeft slideOutRight slideInRight animated');
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

            if (!id.length) {
                id = element.find(self.options.items).first();
            }
            if (element.find(id).length) {
                self.go(id);
            }
        };

        init(this.options);
    }

    context.Spinster = Spinster;
}(window));



