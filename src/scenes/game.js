(function (root) {
    'use strict';

    var GameScene = function () {
        Arcadia.Scene.apply(this, arguments);

        // this.color = 'rgba(0, 0, 0, 0.15)';
        this.color = 'black';
        this.level = 1;
        this.player = new Player();
        this.add(this.player);

        this.playerBullets = new Arcadia.Pool();
        this.add(this.playerBullets);

        var i = 20;
        var b;
        var e;
        while (i -= 1) {
            b = new Arcadia.Shape({
                vertices: 0,
                size: {width: 5, height: 5}
            });
            b.speed = 650;
            this.playerBullets.add(b);
        }

        this.enemyBullets = new Arcadia.Pool();
        this.add(this.enemyBullets);

        i = 20;
        while (i -= 1) {
            b = new EnemyShot({
                type: 'shooter',
                target: this.player
            });
            this.enemyBullets.add(b);
        }

        this.enemies = new Arcadia.Pool();
        this.add(this.enemies);

        i = 50;
        while (i -= 1) {
            e = new Enemy({
                type: 'drone',
                target: this.player
            });
            this.enemies.add(e);
        }

        this.particles = new Arcadia.Pool();
        this.add(this.particles);

        i = 5;
        while (i--) {
            e = new Arcadia.Emitter(function () {
                return new Arcadia.Shape({
                    size: {width: 4, height: 4},
                    color: 'rgba(255, 0, 0, 1)',
                    vertices: 0
                });
            }, 30);
            e.duration = 0.5
            this.particles.add(e);
        }

        this.leftStick = new Joystick();
        this.add(this.leftStick);
        this.deactivate(this.leftStick);

        this.rightStick = new Joystick();
        this.add(this.rightStick);
        this.deactivate(this.rightStick);

        this.leftTouchIndex = null;
        this.rightTouchIndex = null;

        this.setup();
    }

    GameScene.prototype = new Arcadia.Scene();

    /**
     * @description Initialize a new level by spawning a number of enemies, moving the player character to the center, etc.
     */
    GameScene.prototype.setup = function () {
        this.player.position = {x: 0, y: 0};

        this.playerBullets.deactivateAll();
        this.enemyBullets.deactivateAll();
        this.enemies.deactivateAll();

        var i = Math.round(this.level * 1.5);
        var e;

        while (i--) {
            e = this.enemies.activate();
            while (e.collidesWith({position: {x: 0, y: 0}, size: {width: 200, height: 200}})) {
                e.position = {
                    x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
                    y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
                };
            }
        }
    };

    GameScene.prototype.update = function(delta) {
        Arcadia.Scene.prototype.update.call(this, delta);
        var b, e, i, j, particles;

        this.player.timeout += delta;

        // Allow player to shoot
        if ((this.player.shootVector.x !== 0 || this.player.shootVector.y !== 0) &&
            this.player.timeout > this.player.shootRate) {
            this.player.timeout = 0;

            b = this.playerBullets.activate();
            //sona.playSfx('shoot');
            b.velocity.x = Math.cos(this.player.rotation);
            b.velocity.y = Math.sin(this.player.rotation);
            b.position.x = this.player.position.x + b.velocity.x * this.player.size.width / 2;
            b.position.y = this.player.position.y + b.velocity.y * this.player.size.height / 2;
        }

        // Update player shots
        i = this.playerBullets.length;
        while (i--) {
            b = this.playerBullets.at(i);

            if (b.position.y > this.size.height / 2 || b.position.y < -this.size.height / 2 ||
                b.position.x > this.size.width / 2 || b.position.x < -this.size.width / 2) {
                this.playerBullets.deactivate(i);
                continue;
            }

            // Detect collitions between player shots and enemies
            j = this.enemies.length;
            while (j--) {
                e = this.enemies.at(j);
                if (e.collidesWith(b)) {
                    particles = this.particles.activate();
                    particles.color = e.color;
                    particles.start(b.position.x, b.position.y);
                    //sona.play('explosion');
                    this.enemies.deactivate(j);
                    this.playerBullets.deactivate(i);
                    break;
                }
            }
        }

        // Update enemies
        i = this.enemies.length;
        while (i--) {
            e = this.enemies.at(i);
            if (e.shooting) {
                b = this.enemyBullets.activate();
                e.shooting = false;
                b.type = e.type;
                b.velocity.x = Math.cos(e.rotation);
                b.velocity.y = Math.sin(e.rotation);
                b.position.x = e.position.x + b.velocity.x * e.size.width / 2;
                b.position.y = e.position.y + b.velocity.y * e.size.height / 2;
            }

            if (e.collidesWith(this.player)) {
                // TODO: show "lose" screen here
                this.setup();
            }
        }

        // Update enemy shots
        i = this.enemyBullets.length;
        while (i--) {
            b = this.enemyBullets.at(i);

            if (b.position.y > this.size.height / 2 || b.position.y < -this.size.height / 2 ||
                b.position.x > this.size.width / 2 || b.position.x < -this.size.width / 2 ||
                b.lifetime > 2) {
                this.enemyBullets.deactivate(i);
                continue;
            }

            if (b.collidesWith(this.player)) {
                // TODO: show "lose" screen here
                this.setup();
            }
        }

        // Win condition
        if (this.enemies.length === 0) {
            this.level += 1;
            this.setup();
        }
    };

    GameScene.prototype.onKeyDown = function(key) {
        switch (key) {
            case 'w':
                this.player.moveVector.y -= 1;
                break;
            case 's':
                this.player.moveVector.y += 1;
                break;
            case 'a':
                this.player.moveVector.x -= 1;
                break;
            case 'd':
                this.player.moveVector.x += 1;
                break;
            case 'left':
                this.player.shootVector.x -= 1;
                break;
            case 'right':
                this.player.shootVector.x += 1;
                break;
            case 'up':
                this.player.shootVector.y -= 1;
                break;
            case 'down':
                this.player.shootVector.y += 1;
        }

        if (this.player.moveVector.x !== 0 || this.player.moveVector.y !== 0) {
            var angle = Math.atan2(this.player.moveVector.y, this.player.moveVector.x);
            this.player.velocity.x = Math.cos(angle);
            this.player.velocity.y = Math.sin(angle);
        } else {
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }
    };

    GameScene.prototype.onKeyUp = function(key) {
        switch (key) {
            case 'w':
                this.player.moveVector.y += 1;
                break;
            case 's':
                this.player.moveVector.y -= 1;
                break;
            case 'a':
                this.player.moveVector.x += 1;
                break;
            case 'd':
                this.player.moveVector.x -= 1;
                break;
            case 'left':
                this.player.shootVector.x += 1;
                break;
            case 'right':
                this.player.shootVector.x -= 1;
                break;
            case 'up':
                this.player.shootVector.y += 1;
                break;
            case 'down':
                this.player.shootVector.y -= 1;
        }

        if (this.player.moveVector.x !== 0 || this.player.moveVector.y !== 0) {
            var angle = Math.atan2(this.player.moveVector.y, this.player.moveVector.x);
            this.player.velocity.x = Math.cos(angle);
            this.player.velocity.y = Math.sin(angle);
        } else {
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }
    };

    GameScene.prototype.onPointStart = function (points) {
        Arcadia.Scene.prototype.onPointStart.call(this, points);

        var scene = this;
        var index = points.length;
        var point;
        while (index--) {
            point = points[index];

            if (this.leftTouchIndex === null && (point.x > -scene.size.width / 2 && point.x < 0)) {
                this.leftTouchIndex = index;
            }
            if (this.rightTouchIndex === null && (point.x > 0 && point.x < scene.size.width / 2)) {
                this.rightTouchIndex = index;
            }
        }

        if (this.leftStick.active === false && this.leftTouchIndex !== null) {
            this.leftStick.active = true;
            this.leftStick.position.x = points[this.leftTouchIndex].x;
            this.leftStick.position.y = points[this.leftTouchIndex].y;
        }
        if (this.rightStick.active === false && this.rightTouchIndex !== null) {
            this.rightStick.active = true;
            this.rightStick.position.x = points[this.rightTouchIndex].x;
            this.rightStick.position.y = points[this.rightTouchIndex].y;
        }
    };

    GameScene.prototype.onPointMove = function (points) {
        Arcadia.Scene.prototype.onPointMove.call(this, points);
        var angle;
        if (this.leftTouchIndex !== null) {
            angle = Math.atan2(points[this.leftTouchIndex].y - this.leftStick.position.y, points[this.leftTouchIndex].x - this.leftStick.position.x);
            this.leftStick.rotation = angle;
            this.player.moveVector.x = Math.cos(angle);
            this.player.moveVector.y = Math.sin(angle);
        }
        if (this.rightTouchIndex !== null) {
            angle = Math.atan2(points[this.rightTouchIndex].y - this.rightStick.position.y, points[this.rightTouchIndex].x - this.rightStick.position.x);
            this.rightStick.rotation = angle;
            this.player.shootVector.x = Math.cos(angle);
            this.player.shootVector.y = Math.sin(angle);
        }
    };

    GameScene.prototype.onPointEnd = function (points) {
        Arcadia.Scene.prototype.onPointEnd.call(this, points);

        this.player.moveVector.x = 0;
        this.player.moveVector.y = 0;
        this.player.shootVector.x = 0;
        this.player.shootVector.y = 0;
        this.leftStick.active = false;
        this.rightStick.active = false;
        this.leftTouchIndex = null;
        this.rightTouchIndex = null;
    };

    root.GameScene = GameScene;
}(window));
