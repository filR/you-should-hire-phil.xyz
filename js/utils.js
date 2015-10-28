'use strict';

var Utils = {

    /*
     * A simple method to calculate the distance between two points.
     * Careful, it returns not a number, but an object including the dx & dy.
     */
    calcManhattanDistance: function (point1, point2) {
        var dx = point1.x - point2.x;
        var dx2 = dx * dx;

        var dy = point1.y - point2.y;
        var dy2 = dy * dy;

        var total = Math.sqrt(dx2 + dy2);

        return {
            dx: dx,
            dy: dy,
            total: total
        }
    },

    logFPS: function (ctx, name) {

        if (!window.debug) {
            return;
        }

        if (!ctx.lastFPS || ctx.lastFPS + 500 < ctx.millis) {

            var fps = Math.floor(1000 / ctx.dt);

            if (fps < 20) {
                console.error(fps, name);

            } else if (fps < 25) {
                console.warn(fps, name);

            } else if (fps < 100) {
                console.log(fps, name);
            }

            ctx.lastFPS = ctx.millis;
        }
    }

};

module.exports = Utils;
