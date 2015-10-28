'use strict';

var Utils = require('../utils.js');

function Particle(x, y) {
    this.init(x, y);
}

Particle.prototype = {
    MOUSE_RADIUS: 150,
    MOUSE_REPULSION: 0.4,
    MIN_RADIUS: 4,
    MAX_RADIUS: 10,

    init: function (x, y) {

        this.x = x;
        this.y = y;

        this.radius = random(this.MIN_RADIUS, this.MAX_RADIUS);
        this.wander = random(0.5, 2.0);
        this.drag = random(0.9, 0.99);
        this.theta = random(TWO_PI);
        this.color = this.getRandomColor();

        var force = random(2, 8);
        this.vx = Math.sin(this.theta) * force;
        this.vy = Math.cos(this.theta) * force;
    },

    getRandomColor: function () {
        var luminance = Math.floor(random(30, 55));
        return 'hsl(47, 80%, ' + luminance + '%)';
    },

    move: function (ctx) {

        this.applyMouseRepulsion(ctx.mouse);
        this.applyRandomMovement();
        this.loopAroundEdges(ctx);

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.x += this.vx;
        this.y += this.vy;
    },

    applyRandomMovement: function () {
        this.theta += random(-0.5, 0.5) * this.wander;

        this.vx += Math.sin(this.theta) * 0.1;
        this.vy += Math.cos(this.theta) * 0.1;
    },

    applyMouseRepulsion: function (mouse) {
        var distance = Utils.calcManhattanDistance(this, mouse);

        if (distance.total < this.MOUSE_RADIUS) {
            var ratio = this.MOUSE_REPULSION / distance.total;

            this.vx += ratio * distance.dx;
            this.vy += ratio * distance.dy;
        }
    },

    loopAroundEdges: function (ctx) {
        if (this.x < 0) {
            this.x = ctx.width - 0.1;
        }

        if (this.y < 0) {
            this.y = ctx.height - 0.1;
        }

        this.x %= ctx.width;
        this.y %= ctx.height;
    },

    draw: function (ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};


function BallPit(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');
    var particles = [];

    var NUM_BALLS_FACTOR = 0.001;

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,

        setup: function () {
            var numberOfBalls = container.scrollWidth *
                container.scrollHeight * NUM_BALLS_FACTOR;

            this.spawnBalls(numberOfBalls);
        },

        spawnBalls: function (num) {
            var x, y;

            for (var i = 0; i < num; i++) {
                x = random(this.width);
                y = random(this.height);

                particles.push(new Particle(x, y));
            }
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

            var len = particles.length;
            for (var i = 0; i < len; i++) {
                particles[i].draw(this);
            }

            Utils.logFPS(this, 'Ball Pit');
        },

        click: function () {

            var len = particles.length;
            for (var i = 0; i < len; i++) {
                particles[i].vx *= 2;
                particles[i].vy *= 2;
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


module.exports = BallPit;
