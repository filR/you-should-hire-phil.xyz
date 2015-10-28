/*
 * Effect inspired by: http://codepen.io/tholman/pens/popular/
 */

'use strict';

var Utils = require('../utils.js');


function Line(ctx, color, yOffset) {
    this.init(ctx, color, yOffset);
}

Line.prototype = {

    density: 6, // how many links in stripe
    mouseSensitivity: 450, // react how strongly to mouse
    width: 10, // width of line
    overlap: 10, // start line outside of canvas by how much
    color: '#666',

    points: null,

    init: function (ctx, color, yOffset) {
        this.color = color;
        this.points = [];

        var y = (ctx.height / 2) - yOffset;
        this.createLine(-this.overlap, ctx.width + this.overlap, y);
    },

    createLine: function (left, right, y) {
        for (var i = left; i < right; i += this.density) {

            var point = {
                x: i,
                y: y,
                originalX: i,
                originalY: y
            };

            this.points.push(point);
        }
    },

    update: function (mouse) {
        var point;
        for (var i = 0; i < this.points.length; i++) {
            point = this.points[i];

            var mouseInfluence = this.getMouseInfluence(point, mouse);
            var pullToOriginal = this.getPullToOriginal(point);

            point.x += mouseInfluence.x + pullToOriginal.x;
            point.y += mouseInfluence.y + pullToOriginal.y;

        }
    },

    getPullToOriginal: function (point) {
        return {
            x: (point.originalX - point.x) * 0.07,
            y: (point.originalY - point.y) * 0.07
        }
    },

    getMouseInfluence: function (point, mouse) {
        var distance = Utils.calcManhattanDistance(point, mouse);
        var theta = Math.atan2(distance.dy, distance.dx);

        var x = Math.cos(theta) * this.mouseSensitivity / distance.total;
        var y = Math.sin(theta) * this.mouseSensitivity / distance.total;

        return {x: x, y: y};
    },

    draw: function (ctx) {
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.points[0].x, this.points[0].y);

        this.drawSegments(ctx);

        ctx.stroke();
        ctx.closePath();
    },

    drawSegments: function (ctx) {
        var x, y, point, nextPoint;
        var len = this.points.length - 2;
        for (var i = 1; i < len; i++) {

            point = this.points[i];
            nextPoint = this.points[i + 1];

            x = (point.x + nextPoint.x) / 2;
            y = (point.y + nextPoint.y) / 2;

            ctx.quadraticCurveTo(point.x, point.y, x, y);
        }
    }
};


function Stripes(container) {
    var Sketch = require('../../../sketch.js/js/sketch.js');
    var lines = [];

    return Sketch.create({
        retina: true,
        container: container,
        fullscreen: false,
        autopause: false,
        width: container.scrollWidth,
        height: container.scrollHeight,

        setup: function () {
            lines.push(new Line(this, '#DDDDDD', -10));
            lines.push(new Line(this, '#666666', -25));
        },

        update: function () {

            var mouse = this.mouse;
            lines.forEach(function (line) {
                line.update(mouse);
            });
        },

        draw: function () {

            var ctx = this;
            lines.forEach(function (line) {
                line.draw(ctx);
            });

            Utils.logFPS(this, 'Stripes');
        },

        mouseover: function () {
            this.start();
        },

        mouseout: function () {
            this.stop();
        }
    });

}


module.exports = Stripes;
