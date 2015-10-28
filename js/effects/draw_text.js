/*
 * Effect inspired by: http://codepen.io/tholman/pens/popular/
 * Modelled after: http://i.imgur.com/mJ7cXhA.gif
 */

'use strict';

var Utils = require('../utils.js');


// object containing text & styling info
var text = {
    letters: "Hi there, ~1I'm Phil!~0 Scroll down to see the ~2top 5 reasons~0 you should ~1hire me.",
    currentLetterIdx: -1,
    minFontSize: 14,
    fonts: [
        {
            family: "'Playfair Display'",
            variant: '',
            color: '#838B91'
        }, {
            family: "'Playfair Display'",
            variant: 'bold',
            color: 'white'
        }, {
            family: "'Playfair Display'",
            variant: 'bold',
            color: '#FCC908'
        }
    ],
    currentFontIdx: 0,

    init: function () {
        this.currentLetterIdx = -1;
        this.currentFontIdx = 0;
        this.setNextLetter();
        return this;
    },

    getLetter: function () {
        var letter = this.letters[this.currentLetterIdx];
        var font = this.fonts[this.currentFontIdx];

        return {
            letter: letter,
            font: font
        };
    },

    setNextLetter: function () {
        this.currentLetterIdx++;

        // "~" = styling information, not a letter to print
        if (this.letters[this.currentLetterIdx] === '~') {
            this.currentFontIdx = this.letters[this.currentLetterIdx + 1];
            this.currentLetterIdx += 2;
        }
    }
};


// object that does the drawing
var painter = {
    text: null,
    position: {
        x: -1,
        y: -1
    },

    init: function (sketch, text) {
        this.sketch = sketch;
        this.text = text.init();
        this.position = {
            x: this.sketch.mouse.x,
            y: this.sketch.mouse.y
        };
    },

    // set font style on canvas
    updateFontStyle: function () {
        var font = this.text.getLetter().font;

        this.sketch.font = font.variant + ' ' + this.getFontSize() + 'px ' + font.family;
        this.sketch.fillStyle = font.color;
    },

    // font size is dependent on mouse movement
    getFontSize: function () {
        var distance = Utils.calcManhattanDistance(this.sketch.mouse, this.position).total;
        return this.text.minFontSize + distance / 2;
    },

    measureLetterWidth: function () {
        this.updateFontStyle();
        return this.sketch.measureText(this.text.getLetter().letter).width;
    },

    // put a letter on canvas
    drawLetter: function () {
        if (!this.isEnoughSpaceForLetter()) {
            return;
        }

        this.updateFontStyle();
        this.sketch.drawTextOnCanvas(this.sketch, this.text.getLetter().letter, this.position, this.getAngle());
        this.updatePosition();
        this.text.setNextLetter();
    },

    // has the mouse moved enough for a letter to be drawn
    isEnoughSpaceForLetter: function () {
        var spaceAvailable = Utils.calcManhattanDistance(this.sketch.mouse, this.position).total;
        return spaceAvailable > this.measureLetterWidth();
    },

    // angle of the letter (dependent on mouse)
    getAngle: function () {
        var dx = this.sketch.mouse.x - this.position.x;
        var dy = this.sketch.mouse.y - this.position.y;

        return Math.atan2(dy, dx);
    },

    // update where we will draw the next letter
    updatePosition: function () {
        var angle = this.getAngle();
        var width = this.measureLetterWidth();

        this.position.x += Math.cos(angle) * width;
        this.position.y += Math.sin(angle) * width;
    }
};

function DrawText(container) {

    var Sketch = require('../../../sketch.js/js/sketch.js');

    return Sketch.create({

        // sketch init parameters
        retina: true,
        container: container,
        autoclear: false,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,

        inited: false,

        setup: function () {
            document.querySelector('#top .hello').style.display = 'block';
        },

        touchmove: function () {

            // init mouse position
            if (!this.inited) {
                painter.init(this, text);
                this.inited = true;
                return;
            }

            // fade out help text
            if (text.currentLetterIdx > 0) {
                document.querySelector('#top .hello').style.opacity = 0;
            }

            // out of text to draw. the end.
            if (text.currentLetterIdx >= text.letters.length) {
                document.querySelector('#top .redraw').style.opacity = 1;
                return;
            }

            painter.drawLetter();
        },

        click: function () {
            document.querySelector('#top .redraw').style.display = 'none';
            painter.init(this, text);
            this.clear();
        },

        drawTextOnCanvas: function (ctx, string, position, angle) {
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(angle);
            ctx.fillText(string, 0, 0);
            ctx.restore();
        }
    });
}


module.exports = DrawText;
