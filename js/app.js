/*
 * Design inspired by: http://spintank.fr/spinlab/spin/
 */

'use strict';

require('../css/styles.css');

(function () {

    // show content.
    // this is an ugly way of preventing a FOUC.
    document.body.style.display = 'block';

    var effects = [
        {
            Class: require('./effects/draw_text.js'),
            instance: null,
            container: '#top .canvas-container',
            pauseAfter: null
        }, {
            Class: require('./effects/ball_pit.js'),
            instance: null,
            container: '#ball-pit .canvas-container',
            pauseAfter: 0
        }, {
            Class: require('./effects/river.js'),
            instance: null,
            container: '#river .canvas-container',
            pauseAfter: 700
        }, {
            Class: require('./effects/bubbles.js'),
            instance: null,
            container: '#bubbles .canvas-container',
            pauseAfter: 200
        }, {
            Class: require('./effects/stripes.js'),
            instance: null,
            container: '#stripes .canvas-container',
            pauseAfter: 0
        }, {
            Class: require('./effects/brain_failure.js'),
            instance: null,
            container: '#brain-failure .canvas-container',
            pauseAfter: 0
        }, {
            Class: require('./effects/destroy_text.js'),
            instance: null,
            container: '#destroy .canvas-container',
            pauseAfter: 0
        }
    ];

    function init() {
        reset();

        effects.forEach(function (effect) {
            var container = document.querySelector(effect.container);
            effect.instance = new effect.Class(container);

            if (effect.pauseAfter !== null) {
                // start effect paused, but rendered
                setTimeout(effect.instance.stop, effect.pauseAfter);
            }
        });
    }

    function reset() {
        effects.forEach(function (effect) {
            if (effect.instance && effect.instance.destroy) {
                effect.instance.destroy();
            }
        });
    }

    window.onload = window.onresize = init;
})();
