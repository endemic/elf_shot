/*
@description Shape for enemy object. Behavior/display is dependent on the 'type' property.
Types:
    drone
    factory
    mine
    shooter
    tank
    tracker
 */
(function (root) {
    'use strict';
    var sprite = [
        'xx..xx..',
        'x.xxx..x',
        'x..x.x.x',
        'xxxxxxxx',
        '..x.xx..',
        '..xxxx..',
        '...xxxx.',
        '......xx'
    ];

    /*
    var sprite = [
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........'
    ];

    var sprite = [
        '..oooo..',
        '.oo..oo.',
        '.oooooo.',
        '..oooo..',
        '.oooooo.',
        '.oo..oo.',
        '..o...o.',
        '.oo..oo.'
    ];
   */

    var Enemy = function (options) {
        Arcadia.Shape.call(this, options);

        this.pathData = sprite.join('').split('');

        switch (this.type) {
            case 'drone':
                this.color = this.originalColor = 'rgba(255, 0, 50, 1)';
                this.size = {width: 16, height: 16};
                this.speed = this.originalSpeed = 75;
                this.lineWidth = 3;
                break;
            case 'shooter':
                this.color = this.originalColor = 'rgba(50, 255, 50, 1)';
                this.size = {width: 16, height: 16};
                this.speed = this.originalSpeed = 100;
                this.lineWidth = 3;
                break;
            case 'mine':
                this.vertices = 0;
                this.color = this.originalColor = 'rgba(0, 255, 0, 0.5';
                this.size = {width: 16, height: 16};
                this.speed = this.originalSpeed = 0;
                this.lineWidth = 3;
        }
        // this.rotation = 270 * 180 / Math.PI;
        this.rotation = 0;
        this.counter = 0;
        this.cycle = 1;
        this.shooting = false;
    }

    Enemy.prototype = new Arcadia.Shape();

    Enemy.prototype.path = function (context) {
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

    Enemy.prototype.update = function (delta) {
        Arcadia.Shape.prototype.update.call(this, delta);

        switch (this.type) {
            case 'drone':
              /*
                this.color.blue += this.cycle;
                if (this.color.blue > 255 || this.color.blue < 50) {
                    this.cycle *= -1;
                }
               */
                this.counter += delta;
                if (this.counter > 3 && this.speed < 145) {
                    this.speed += 1;
                }
                if (this.target != null) {
                    var angle = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x);
                    this.velocity.x = Math.cos(angle);
                    this.velocity.y = Math.sin(angle);
                }
                break;
            case 'shooter':
                this.counter += delta;
                if (this.counter > 2) {
                    this.shooting = true;
                    this.counter = 0;
                }
                if (this.target != null) {
                    this.rotation = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x);
                    if (distance(this.target.position, this.position) < 300) {
                        this.velocity.x = -Math.cos(this.rotation);
                        this.velocity.y = -Math.sin(this.rotation);
                    } else {
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                    }
                }
                break;
            case 'mine':
                this.alpha -= this.cycle / 255;
                if (this.alpha >= 0.5 || this.alpha < 0.1) {
                    this.cycle *= -1;
                }
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

    Enemy.prototype.reset = function () {
        this.color = this.originalColor;
        this.speed = this.originalSpeed;
        this.counter = 0;
        this.shooting = false;
    };

    root.Enemy = Enemy;
}(window));
