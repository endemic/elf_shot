/*
@description Shape for virtual joystick
 */

(function (root) {
    'use strict';

    var Joystick = function (options) {
        Arcadia.Shape.call(this, options);

        this.lineWidth = 5;
        this.size = {
            width: 100,
            height: 100
        };
    }

    Joystick.prototype.path = function (context) {
        context.beginPath();
        context.arc(0, 0, this.size / 2, 360, false);
        context.arc(0, 0, this.size / 4, 360, false);
        context.closePath();
        context.strokeStyle = 'white';
        context.stroke();
    };

    root.Joystick = Joystick;
}(window));
