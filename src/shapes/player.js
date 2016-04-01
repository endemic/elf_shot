/**
 * @description Shape for player avatar
 */
(function (root) {
    'use strict';

    var sprite = [
        'xxxxxx..',
        '.xxxxxx.',
        '.x...x..',
        '........',
        '.xxxxx..',
        'x.xxx.x.',
        'xxxxxx..',
        '.xx..xx.'
    ];

    var Player = function (options) {
        Arcadia.Shape.call(this, options);

        this.pathData = sprite.join('').split('');

        this.vertices = 3;
        this.size = {
            width: 16,
            height: 16
        };
        this.speed = 150;
        this.lineWidth = 3;
        // this.rotation = 270 * 180 / Math.PI;
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

    Player.prototype = new Arcadia.Shape();

    Player.prototype.path = function (context) {
        if (!this.pathData) {
            return;
        }

        var size = Math.sqrt(this.pathData.length);
        var pixelSize = this.size.width / size * Arcadia.PIXEL_RATIO;

        var originX = -this.size.width / 2 * Arcadia.PIXEL_RATIO;
        var originY = -this.size.height / 2 * Arcadia.PIXEL_RATIO;

        context.fillStyle = this.color;

        this.pathData.forEach(function (point, index) {
            var x = index % size;
            var y = Math.floor(index / size);

            if (point === '.') {
                return;
            }

            context.fillRect(originX + (x * pixelSize),
                             originY + (y * pixelSize),
                             pixelSize + 1,  // Adding extra width/height here to prevent
                             pixelSize + 1); // faint, white lines between pixels
        });
    };

    // Player.prototype.path = function (context) {
    //     context.strokeStyle = 'white';

    //     context.beginPath();
    //     context.arc(1, 0, this.size.width / 2, 2 * Math.PI, false);
    //     context.closePath();
    //     context.stroke();

    //     context.beginPath();
    //     context.moveTo(this.size.width / 2 * Math.cos(0), this.size.height / 2 * Math.sin(0));
    //     context.lineTo(this.size.width / 2 * Math.cos(120 * Math.PI / 180), this.size.height / 2 * Math.sin(120 * Math.PI / 180));
    //     context.lineTo(-this.size.width / 10, 0);
    //     context.lineTo(this.size.width / 2 * Math.cos(240 * Math.PI / 180), this.size.height / 2 * Math.sin(240 * Math.PI / 180));
    //     context.lineTo(this.size.width / 2 * Math.cos(0), this.size.height / 2 * Math.sin(0));
    //     context.closePath();

    //     context.stroke();
    // };

    Player.prototype.update = function (delta) {
        Arcadia.Shape.prototype.update.call(this, delta);

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            // this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
        }
        if (this.shooting.x !== 0 || this.shooting.y !== 0) {
            // this.rotation = Math.atan2(this.shooting.y, this.shooting.x);
        }

        if (this.position.x + this.size.width / 2 > Arcadia.VIEWPORT_WIDTH / 2) {
            this.position.x = -Arcadia.VIEWPORT_WIDTH / 2 + this.size.width / 2;
        }
        if (this.position.x - this.size.width / 2 < -Arcadia.VIEWPORT_WIDTH / 2) {
            this.position.x = Arcadia.VIEWPORT_WIDTH / 2 - this.size.width / 2;
        }
        if (this.position.y + this.size.height / 2 > Arcadia.VIEWPORT_HEIGHT / 2) {
            this.position.y = -Arcadia.VIEWPORT_HEIGHT / 2 + this.size.height / 2;
        }
        if (this.position.y - this.size.height / 2 < -Arcadia.VIEWPORT_HEIGHT / 2) {
            return this.position.y = Arcadia.VIEWPORT_HEIGHT / 2 - this.size.height / 2;
        }
    };

    root.Player = Player;
}(window));
