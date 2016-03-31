(function (root) {
    'use strict';

    var Player = function (options) {
        Arcadia.Shape.call(this, options);
        this.vertices = 3;
        this.size = {
            width: 40,
            height: 40
        };
        this.speed = 150;
        this.lineWidth = 3;
        this.rotation = 270 * 180 / Math.PI;
        this.shootRate = 0.25;
        this.timeout = 0;
        this.shooting = {
            x: 0,
            y: 0
        };
        this.angle = {
            x: 0,
            y: 0
        };
    }

    Player.prototype.path = function (context) {
        context.beginPath();
        context.arc(1, 0, this.size.width / 2, 360, false);
        context.moveTo(this.size.width / 2 * Math.cos(0), this.size.height / 2 * Math.sin(0));
        context.lineTo(this.size.width / 2 * Math.cos(120 * Math.PI / 180), this.size.height / 2 * Math.sin(120 * Math.PI / 180));
        context.lineTo(-this.size.width / 10, 0);
        context.lineTo(this.size.width / 2 * Math.cos(240 * Math.PI / 180), this.size.height / 2 * Math.sin(240 * Math.PI / 180));
        context.lineTo(this.size.width / 2 * Math.cos(0), this.size.height / 2 * Math.sin(0));
        context.closePath();
        context.strokeStyle = 'white';
        return context.stroke();
    };

    Player.prototype.update = function (delta) {
        Arcadia.Shape.prototype.update.call(this, delta);

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
        }
        if (this.shooting.x !== 0 || this.shooting.y !== 0) {
            this.rotation = Math.atan2(this.shooting.y, this.shooting.x);
        }

        // if (this.position.x + this.size.width / 2 > Arcadia.WIDTH) {
        //     this.position.x = Arcadia.WIDTH - this.size.width / 2;
        // }
        // if (this.position.x - this.size.width / 2 < 0) {
        //     this.position.x = this.size.width / 2;
        // }
        // if (this.position.y + this.size.width / 2 > Arcadia.HEIGHT) {
        //     this.position.y = Arcadia.HEIGHT - this.size.width / 2;
        // }
        // if (this.position.y - this.size.width / 2 < 0) {
        //     this.position.y = this.size.width / 2;
        // }
    };

    root.Player = Player;
}(window));


/*
@description Shape for player avatar
 */
