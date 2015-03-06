'use strict';
(function(context){

    function Spinster(element, options){

        var self = this;
        var element = element || $('</div>');

        /**
         * Merge passed in options with defaults
         * @type Object
         */
        this.options = jQuery.extend({
            container: '.spinster-container',
            keyframes: '.spinster-keyframe'
        }, options || {});

        /**
         * @param target string|jQuery
         */
        this.go = function(target){
            var old = element.find('.active');
            target = target.jquery? target : element.find(target);
            old.toggleClass('active');
            target.toggleClass('active');
        };

        /**
         * @returns {*|jQuery|HTMLElement}
         */
        this.getElement = function(){
            return element;
        };


        this.onHashChange = function(){
            var id = window.location.hash;

            if (!id.length) {
                id = element.find('.spinster-keyframe').first();
            }
            if (element.find(id).length) {
                self.go(id);
            }
        };

        window.addEventListener("hashchange", self.onHashChange, false);

        if (window.location.hash) {
            self.onHashChange();
        }
    }

    context.Spinster = Spinster;
}(window));
