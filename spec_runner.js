require.config({
    paths: {
        'jquery': './bower_components/jquery/dist/jquery',
        'underscore': './bower_components/underscore/underscore',
        'mocha': './bower_components/mocha/mocha',
        'spinster': './spinster',
        'chai' : './bower_components/chai/chai'
    },
    shim: {
        mocha: { exports: 'mocha' }
    }

});

define(['mocha', 'chai'], function(mocha, chai){

    // bind chai expect to global namespace.
    var expect = window.expect = chai.expect;

    mocha.setup('bdd');

    require(['./specs/spinster_specs.js'], function(){
        mocha.run();
    });
});