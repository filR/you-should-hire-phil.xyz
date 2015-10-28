/*
 * Effect inspired by: http://codepen.io/tholman/pens/popular/
 */

'use strict';

var Utils = require('../utils.js');


// http://codepen.io/tholman/pen/zvbdo


function BrainFailure(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');
    var BezierEasing = require('../../node_modules/bezier-easing/index.js');

    var COLOUR1 = 'hsl(48, 0%, 85%)';
    var COLOUR2 = 'hsl(48, 0%, 100%)';
    var PLUS_WIDTH = 75;
    var ANIMATION_LENGTH = 1450;
    var STYLES = [
        {
            colour: {
                plus: COLOUR2,
                bg: COLOUR1
            },
            offset: {
                x: 0,
                y: 0
            },
            reverse: false
        }, {
            colour: {
                plus: COLOUR1,
                bg: COLOUR2
            },
            offset: {
                x: -PLUS_WIDTH * 2 / 3,
                y: -PLUS_WIDTH / 3
            },
            reverse: true
        }
    ];

    var nextSwitch;
    var currentStyle = 0;

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,

        setup: function () {
            this.swapStyle();
        },

        swapStyle: function () {
            nextSwitch = this.millis + ANIMATION_LENGTH;
            currentStyle++;
            currentStyle %= STYLES.length;
        },

        update: function () {
            if (this.millis > nextSwitch) {
                this.swapStyle();
            }
        },

        draw: function () {
            this.drawBackground();

            var rotate = this.getRotation();

            var col = -this.width / PLUS_WIDTH; // need overlap, don't start with 0
            while (col < this.width / PLUS_WIDTH) {
                this.drawRow(col, rotate);
                col++;
            }

            Utils.logFPS(this, 'Brain Failure');
        },

        drawBackground: function () {
            this.fillStyle = STYLES[currentStyle].colour.bg;
            this.fillRect(0, 0, this.width, this.height);
        },

        drawRow: function (col, rotate) {
            var x = col * PLUS_WIDTH;

            for (var row = 0; row < this.height / PLUS_WIDTH + 11; row++) {

                x += PLUS_WIDTH / 3;
                var y = row * PLUS_WIDTH - ((col % 10) * PLUS_WIDTH / 3);

                if (this.isPlusOnCanvas(x, y)) {
                    this.drawPlus(x, y, rotate);
                }
            }
        },

        isPlusOnCanvas: function (x, y) {
            return y > -PLUS_WIDTH &&
                   y < this.height + PLUS_WIDTH &&
                   x > -PLUS_WIDTH &&
                   x < this.width + PLUS_WIDTH;
        },

        getRotation: function () {
            var percent = (nextSwitch - this.millis) / ANIMATION_LENGTH;
            var weightedPercent = BezierEasing.easeInOut.get(percent);

            if (STYLES[currentStyle].reverse) {
                weightedPercent = 90 - weightedPercent;
            }

            return weightedPercent * Math.PI / 2; // return radians
        },

        drawPlus: function (x, y, rotate) {

            x += STYLES[currentStyle].offset.x;
            y += STYLES[currentStyle].offset.y;

            this.translate(x, y);
            this.rotate(rotate);

            this.fillStyle = STYLES[currentStyle].colour.plus;
            this.fillRect(-PLUS_WIDTH / 2, -PLUS_WIDTH / 6, PLUS_WIDTH, PLUS_WIDTH / 3);
            this.fillRect(-PLUS_WIDTH / 6, -PLUS_WIDTH / 2, PLUS_WIDTH / 3, PLUS_WIDTH);

            this.rotate(-rotate);
            this.translate(-x, -y);
        },

        // switch colours
        click: function () {
            var c = STYLES[0].colour;
            STYLES[0].colour = STYLES[1].colour;
            STYLES[1].colour = c;
        },

        mouseover: function () {
            this.start();
        },

        mouseout: function () {
            this.stop();
        }
    });
}


module.exports = BrainFailure;
