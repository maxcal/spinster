require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'underscore': '../bower_components/underscore/underscore',
        'modernizr': '../bower_components/modernizr/modernizr'
    }
});

require(['jquery', 'spinster'], function($, Spinster){
    jQuery(function(){
        new Spinster($('#spinster'));
        $('#toggle-transitions').click(function(){
            var state;
            $('html').toggleClass('csstransitions')
                .toggleClass('no-csstransitions');
            state = $('html').hasClass('csstransitions');

            $(this).toggleClass('off');
            console.log('turning csstransitions:', state ? 'on' : 'off'  );

            Modernizr.csstransitions = state;
        });
    });
});