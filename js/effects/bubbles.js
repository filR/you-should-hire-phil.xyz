/*
 * Effect inspired by: https://soulwire.github.io/sketch.js/
 */

'use strict';

var Utils = require('../utils.js');


function Particle(x, y, radius) {
    this.init(x, y, radius);
}

Particle.prototype = {

    init: function (x, y, radius) {
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.alive = true;
        this.color = this.getRandomColor();
        this.wander = random(0.5, 2.0);
        this.drag = random(0.9, 0.99);
        this.theta = random(TWO_PI);

        var force = this.radius > 35 ? random(4, 16) : random(2, 8);

        this.vx = sin(this.theta) * force;
        this.vy = cos(this.theta) * force;
    },

    getRandomColor: function () {
        var luminance = Math.floor(random(30, 55));
        var saturation = Math.floor(random(30, 80));
        return 'hsl(47, ' + saturation + '%, ' + luminance + '%)';
    },

    move: function () {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.theta += random(-0.5, 0.5) * this.wander;
        this.vx += sin(this.theta) * 0.1;
        this.vy += cos(this.theta) * 0.1;

        this.radius *= 0.96;
        this.alive = this.radius > 0.5;
    },

    draw: function (ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};


function Bubbles(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');

    var MAX_PARTICLES = 280;
    var SPAWN_ON_TOUCH = 4;
    var SPAWN_ON_CLICK = 50;
    var INITIAL_PARTICLES = 40;

    var particles = [];
    var deadParticles = [];

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,

        setup: function () {
            this.globalCompositeOperation = 'lighter';
            this.spawnInitialParticles(INITIAL_PARTICLES);

        },

        spawnInitialParticles: function (num) {
            for ( var i = 0; i < num; i++ ) {
                var x = ( this.width * 0.5 ) + random( -100, 100 );
                var y = ( this.height * 0.5 ) + random( -100, 100 );
                this.spawn( x, y );
            }
        },

        spawn: function (x, y, large) {

            if (particles.length >= MAX_PARTICLES) {
                deadParticles.push(particles.shift());
            }

            var particle = deadParticles.length ? deadParticles.pop() : new Particle();

            var size = large ? random(30, 80) : random(5, 40);
            particle.init(x, y, size);

            particles.push(particle);
        },

        update: function () {

            var particle;
            for ( var i = particles.length - 1; i >= 0; i-- ) {

                particle = particles[i];

                if (particle.alive) {
                    particle.move();
                } else {
                    deadParticles.push(particles.splice(i, 1)[0]);
                }
            }
        },

        draw: function () {

            var len = particles.length;
            for (var i = 0; i < len; i++) {
                particles[i].draw(this);
            }

            Utils.logFPS(this, 'Bubbles');
        },

        touchmove: function () {

            var touch = this.touches[0];
            var max = random(1, SPAWN_ON_TOUCH);

            for (var j = 0; j < max; j++) {
                this.spawn(touch.x, touch.y);
            }

        },

        click: function () {
            for (var i = 0; i < SPAWN_ON_CLICK; i++) {
                this.spawn(this.touches[0].x, this.touches[0].y, true);
            }
        },

        mouseover: function () {
            this.start();
        },

        mouseout: function () {
            this.stop();
        }
    });
}


module.exports = Bubbles;
