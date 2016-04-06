/**
 * @description Shape for player avatar
 */
(function (root) {
    'use strict';

    var sprites = {
        frontLeft: [
            '..xxxxxx',
            '.xxxxxx.',
            '..x...x.',
            '........',
            '..xxxxx.',
            '.x.xxx.x',
            '..xxxxxx',
            '.xx..xx.'
        ],
        frontRight: [
            'xxxxxx..',
            '.xxxxxx.',
            '.x...x..',
            '........',
            '.xxxxx..',
            'x.xxx.x.',
            'xxxxxx..',
            '.xx..xx.'
        ],
        backLeft: [
            '..xxxxxx',
            '.xxxxxx.',
            '..xxxxx.',
            '........',
            '..xxxxx.',
            '.x.xxxxx',
            '..xxxx.x',
            '.xxx.xx.'
        ],
        backRight: [
            'xxxxxx..',
            '.xxxxxx.',
            '.xxxxx..',
            '........',
            '.xxxxx..',
            'xxxxx.x.',
            'x.xxxx..',
            '.xx.xxx.'
        ]
    };

    var Player = function (options) {
        Arcadia.Shape.call(this, options);

        this.orientation = 'frontLeft';

        this.vertices = 3;
        this.size = {
            width: 16,
            height: 16
        };
        this.speed = 150;
        this.lineWidth = 3;
        this.shootRate = 0.25;
        this.timeout = 0;
        this.shootVector = {x: 0, y: 0};
        this.moveVector = {x: 0, y: 0};
    }

    Player.prototype = new Arcadia.Shape();

    Player.prototype.path = function (context) {
        var pixelData = sprites[this.orientation].join('').split('');
        var size = Math.sqrt(pixelData.length);
        var pixelSize = this.size.width / size * Arcadia.PIXEL_RATIO;

        var originX = -this.size.width / 2 * Arcadia.PIXEL_RATIO;
        var originY = -this.size.height / 2 * Arcadia.PIXEL_RATIO;

        context.fillStyle = this.color;

        pixelData.forEach(function (point, index) {
            if (point === '.') {
                return;
            }

            var x = index % size;
            var y = Math.floor(index / size);

            context.fillRect(originX + (x * pixelSize),
                             originY + (y * pixelSize),
                             pixelSize + 1,  // Adding extra width/height here to prevent
                             pixelSize + 1); // faint lines between pixels
        });
    };

    Player.prototype.update = function (delta) {
        Arcadia.Shape.prototype.update.call(this, delta);

        var angle = 0;

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            angle = Math.atan2(this.velocity.y, this.velocity.x);
        }

        if (this.shootVector.x !== 0 || this.shootVector.y !== 0) {
            angle = Math.atan2(this.shootVector.y, this.shootVector.x);
        }

        var newOrientation;

        if (angle > 0 && angle < Math.PI / 2) {
            newOrientation = 'backRight';
        } else if (angle >= Math.PI / 2 && angle < Math.PI) {
            newOrientation = 'backLeft';
        } else if (angle >= Math.PI && angle < Math.PI + Math.PI / 2) {
            newOrientation = 'frontLeft';
        } else {
            newOrientation = 'frontRight';
        }

        if (newOrientation !== this.orientation) {
            this.orientation = newOrientation;
            this.dirty = true;
        }

        // TODO: remove this
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
            this.position.y = Arcadia.VIEWPORT_HEIGHT / 2 - this.size.height / 2;
        }
    };

    root.Player = Player;
}(window));
