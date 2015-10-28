/*
 * Effect inspired by: http://spintank.fr/spinlab/spin/
 */

'use strict';

var Utils = require('../utils.js');


function Particle(x, boundary, color) {
    this.init(x, boundary, color);
}

Particle.prototype = {
    mouseRadius: 75,
    mouseRepulsion: -0.4,
    velocity: 0.3,
    friction: 0.95,
    boundaryNudge: 0.4,


    init: function (x, boundary, color) {
        this.BOUNDARY = boundary;
        this.color = color || '#666';

        this.reset(x);
    },

    reset: function (x) {
        this.x = x || -this.vx * 2;
        this.y = random(this.BOUNDARY.min, this.BOUNDARY.max);
        this.vx = 5.0;
        this.vy = 0.0;
    },

    move: function (ctx) {

        if (this.isOutOfBounds(ctx)) {
            this.reset();
        }

        this.vx += this.velocity;
        this.vy += this.velocity * random(-1, 1);

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.nudgeIntoBoundary();
        this.applyMouse(ctx.mouse);

        this.x += this.vx;
        this.y += this.vy;
    },

    nudgeIntoBoundary: function () {
        if (this.y > this.BOUNDARY.max) {
            this.vy -= this.boundaryNudge;
        } else if (this.y < this.BOUNDARY.min) {
            this.vy += this.boundaryNudge;
        }
    },

    applyMouse: function (mouse) {
        var distance = Utils.calcManhattanDistance(mouse, this);

        if (distance.total < this.mouseRadius) {
            var ratio = this.mouseRepulsion / distance.total;

            this.vx += ratio * distance.dx;
            this.vy += ratio * distance.dy;
        }

    },

    draw: function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx, this.y - this.vy);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    },

    isOutOfBounds: function (ctx) {
        return this.x > ctx.width + this.vx * 2;
    }
};


function River(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');

    var particles = [];
    var FLOW_WIDTH = 0.15;
    var FLOW_OFFSET = 0.17;
    var CLEAR_COLOR = 'rgba(255, 255, 255, 0.05)';
    var NUM_PARTICLES_MULTIPLIER = 1.1;

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,
        autoclear: false,


        setup: function () {
            var boundary = this.getBoundary();
            var num = NUM_PARTICLES_MULTIPLIER * this.width;

            for (var i = 0; i < num; i++) {
                var x = random(this.width);
                this.spawn(x, boundary);
            }
        },

        getBoundary: function () {
            var centre = this.height / 2;
            var width = FLOW_WIDTH * this.height;
            var offset = FLOW_OFFSET * this.height;

            return {
                min: centre - offset - offset,
                max: centre + width - offset
            };
        },

        spawn: function (x, boundary) {

            var color = 'hsl(0, 0%, ' + Math.floor(random(30, 70)) + '%)';
            var particle = new Particle(x, boundary, color);
            particles.push(particle);
        },


        update: function () {

            var particle;
            var len = particles.length;
            for (var i = 0; i < len; i++) {
                particle = particles[i];
                particle.move(this);
            }
        },

        draw: function () {

            // fade over time
            this.fillStyle = CLEAR_COLOR;
            this.fillRect(0, 0, this.width * 2, this.height * 2);

            var len = particles.length;
            for (var i = 0; i < len; i++) {
                particles[i].draw(this);
            }

            Utils.logFPS(this, 'River');
        },

        mouseover: function () {
            this.start();
        },

        mouseout: function () {
            this.stop();
        }
    });
}


module.exports = River;
