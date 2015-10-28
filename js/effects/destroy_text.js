/*
 * Effect inspired by: http://codepen.io/tholman/pens/popular/
 */

'use strict';

var Utils = require('../utils.js');


function getPixelsForWord(width, height, word, density, radius) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var WORD_PADDING = 50;

    function setup(word) {
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#000000";
        setFontSize(ctx, getFontSize(canvas, ctx, word));
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        ctx.fillText(word, width / 2, height / 2);
    }

    function getCoords(canvas, ctx, density, radius) {

        if (canvas.width === 0 ||
            canvas.height === 0) {
            return [];
        }

        var pixels = [];
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (var y = 0; y < canvas.height; y += density) {
            for (var x = 0; x < canvas.width; x += density) {

                var location = (((x + (y * canvas.width)) * radius) - 1);
                if (imageData.data[location] == 255) { // black
                    pixels.push({x: x, y: y});
                }

            }
        }

        return pixels;
    }

    function getFontSize(canvas, ctx, word) {
        var size = 225;

        while (isWordLargerThanCanvas(canvas, ctx, word, size) && size > 0) {
            size -= 20;
        }

        return size;
    }

    function setFontSize(ctx, size) {
        ctx.font = "bold " + size + "px impact, 'Open Sans Condensed'";
    }

    function isWordLargerThanCanvas(canvas, ctx, word, size) {
        setFontSize(ctx, size);

        var wordWidth = ctx.measureText(word).width;
        return wordWidth + WORD_PADDING > canvas.width;
    }

    setup(word);
    return getCoords(canvas, ctx, density, radius);
}

function Particle(x, y, radius) {
    this.init(x, y, radius);
}

Particle.prototype = {
    COLOR: '#FDC900',
    DRAG: 0.995,
    MOUSE_THRESHOLD_SPEED: 1.0,
    MOUSE_RADIUS: 20,
    CLICK_RADIUS: 60,

    init: function (x, y, radius) {
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.released = false;
    },

    update: function () {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.DRAG;
        this.vy *= this.DRAG;
    },

    draw: function (ctx) {
        ctx.fillStyle = this.COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI, true);
        ctx.closePath();
        ctx.fill();
    },

    isOutOfBounds: function (ctx) {
        return this.x < -this.radius ||
            this.x > ctx.width + this.radius ||
            this.y < -this.radius ||
            this.y > ctx.height + this.radius;
    },

    updateMouse: function (mouse, isClick) {

        var distance = Utils.calcManhattanDistance(this, mouse);
        var threshold = isClick ? this.CLICK_RADIUS : this.MOUSE_RADIUS;

        if (distance.total < threshold) {

            this.released = true;
            if (this.vx < this.MOUSE_THRESHOLD_SPEED &&
                this.vy < this.MOUSE_THRESHOLD_SPEED) {

                this.vx = distance.dx / 4 + random(-2, 2);
                this.vy = distance.dy / 4 + random(-2, 2);
            }
        }
    }
};


function Destroy(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');

    var WORD = "THANKS";
    var DENSITY = 10;
    var RADIUS = 4;

    var particles = [];

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,


        setup: function () {
            container.style.backgroundColor = '';
            var pixels = getPixelsForWord(this.width, this.height, WORD, DENSITY, RADIUS);
            pixels.forEach(this.spawn);
            this.preloadWinImage();
        },

        spawn: function (location) {
            particles.push(new Particle(location.x, location.y, RADIUS));
        },

        update: function () {

            var particle;
            for (var i = particles.length - 1; i >= 0; i--) {
                particle = particles[i];

                if (particle.isOutOfBounds(this)) {
                    particles.splice(i, 1);
                }

                particle.update();
            }
        },

        touchmove: function () {
            this.updateMouseOnParticles();
        },

        click: function () {
            this.updateMouseOnParticles(true);
        },

        updateMouseOnParticles: function (isClick) {
            var length = particles.length;
            for (var i = 0; i < length; i++) {
                particles[i].updateMouse(this.mouse, isClick);
            }
        },

        arePixelsLeft: function () {
            var len = particles.length;
            for (var i = 0; i < len; i++) {
                if (!particles[i].released) {
                    return true;
                }
            }
            return false;
        },

        preloadWinImage: function () {
            this.winImage = new Image();
            this.winImage.src = 'images/winner.png';
        },

        drawWin: function () {
            var height = this.height * 0.6;
            var width = height / this.winImage.height * this.winImage.width;
            var x = this.width / 2 - width / 2;
            var y = this.height / 2 - height / 2;

            this.drawImage(this.winImage, x, y, width, height);
            this.container.style.backgroundColor = 'black';
        },

        draw: function () {

            if (!this.arePixelsLeft()) {
                this.drawWin();
            }

            var length = particles.length;
            for (var i = 0; i < length; i++) {
                particles[i].draw(this);
            }

            Utils.logFPS(this, 'Destroy Text');
        },

        mouseover: function () {
            this.start();
        },

        mouseout: function () {
            this.stop();
        }
    });
}


module.exports = Destroy;
