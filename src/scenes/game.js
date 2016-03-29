/*
@description Game scene
 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr', 'buzz', 'cs!shapes/player', 'cs!shapes/joystick', 'cs!shapes/enemy', 'cs!shapes/enemy-shot'], function(Vectr, Buzz, Player, Joystick, Enemy, EnemyShot) {
  var Game;
  return Game = (function(superClass) {
    extend(Game, superClass);

    function Game() {
      var b, e, i;
      Game.__super__.constructor.call(this);
      this.clearColor = 'rgba(0, 0, 0, 0.15)';
      this.level = 1;
      this.player = new Player(Vectr.WIDTH / 2, Vectr.HEIGHT / 2);
      this.add(this.player);
      this.playerBullets = new Vectr.Pool();
      this.add(this.playerBullets);
      i = 20;
      while (i -= 1) {
        b = new Vectr.Shape(0, 0, "circle", 5);
        b.solid = true;
        b.speed = 650;
        b.active = false;
        this.playerBullets.add(b);
      }
      this.enemyBullets = new Vectr.Pool();
      this.add(this.enemyBullets);
      i = 20;
      while (i -= 1) {
        b = new EnemyShot(0, 0, "shooter", this.player);
        b.active = false;
        this.enemyBullets.add(b);
      }
      this.enemies = new Vectr.Pool();
      this.add(this.enemies);
      i = 50;
      while (i -= 1) {
        e = new Enemy(0, 0, 'drone');
        e.target = this.player;
        e.active = false;
        this.enemies.add(e);
      }
      this.particles = new Vectr.Pool();
      this.add(this.particles);
      i = 5;
      while (i--) {
        e = new Vectr.Emitter(30, 0.5, 'circle', 4, 'rgba(255, 0, 0, 1)');
        this.particles.add(e);
      }
      this.leftStick = new Joystick(0, 0);
      this.leftStick.active = false;
      this.add(this.leftStick);
      this.rightStick = new Joystick(0, 0);
      this.rightStick.active = false;
      this.add(this.rightStick);
      this.leftTouchIndex = null;
      this.rightTouchIndex = null;
      this.setup();
    }


    /*
    		@description Initialize a new level by spawning a number of enemies, moving the player character to the center, etc.
     */

    Game.prototype.setup = function() {
      var e, i, results;
      this.player.position.x = Vectr.WIDTH / 2;
      this.player.position.y = Vectr.HEIGHT / 2;
      this.playerBullets.deactivateAll();
      this.enemyBullets.deactivateAll();
      this.enemies.deactivateAll();
      i = Math.round(this.level * 1.5);
      results = [];
      while (i -= 1) {
        e = this.enemies.activate();
        if (e !== null) {
          e.reset();
          e.position.x = Math.random() * Vectr.WIDTH;
          e.position.y = Math.random() * Vectr.HEIGHT;
          while (e.collidesWith({
              position: {
                x: Vectr.WIDTH / 2,
                y: Vectr.HEIGHT / 2
              },
              size: 200
            })) {
            e.position.x = Math.random() * Vectr.WIDTH;
            e.position.y = Math.random() * Vectr.HEIGHT;
          }
          results.push(e.active = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Game.prototype.update = function(delta) {
      var b, e, i, j, particles;
      Game.__super__.update.call(this, delta);
      this.player.timeout += delta;
      if ((this.player.shooting.x !== 0 || this.player.shooting.y !== 0) && this.player.timeout > this.player.shootRate) {
        this.player.timeout = 0;
        b = this.playerBullets.activate();
        if (b !== null) {
          Vectr.playSfx('shoot');
          b.velocity.x = Math.cos(this.player.rotation);
          b.velocity.y = Math.sin(this.player.rotation);
          b.position.x = this.player.position.x + b.velocity.x * this.player.size / 2;
          b.position.y = this.player.position.y + b.velocity.y * this.player.size / 2;
        }
      }
      i = this.playerBullets.length;
      while (i--) {
        b = this.playerBullets.at(i);
        if (b === null) {
          continue;
        }
        if (b.position.y > Vectr.HEIGHT || b.position.y < 0 || b.position.x > Vectr.WIDTH || b.position.x < 0) {
          this.playerBullets.deactivate(i);
          continue;
        }
        j = this.enemies.length;
        while (j--) {
          e = this.enemies.at(j);
          if (e === null) {
            continue;
          }
          if (e.collidesWith(b)) {
            particles = this.particles.activate();
            if (particles !== null) {
              particles.color.red = e.color.red;
              particles.color.green = e.color.green;
              particles.color.blue = e.color.blue;
              particles.start(b.position.x, b.position.y);
            }
            Vectr.playSfx('explosion');
            this.enemies.deactivate(j);
            this.playerBullets.deactivate(i);
            break;
          }
        }
      }
      j = this.enemies.length;
      while (j--) {
        e = this.enemies.at(j);
        if (e === null) {
          continue;
        }
        if (e.shooting) {
          b = this.enemyBullets.activate();
          if (b !== null) {
            e.shooting = false;
            b.type = e.type;
            b.velocity.x = Math.cos(e.rotation);
            b.velocity.y = Math.sin(e.rotation);
            b.position.x = e.position.x + b.velocity.x * e.size / 2;
            b.position.y = e.position.y + b.velocity.y * e.size / 2;
          }
        }
        if (e.collidesWith(this.player)) {
          this.setup();
        }
      }
      i = this.enemyBullets.length;
      while (i--) {
        b = this.enemyBullets.at(i);
        if (b === null) {
          continue;
        }
        if (b.position.y > Vectr.HEIGHT || b.position.y < 0 || b.position.x > Vectr.WIDTH || b.position.x < 0 || b.lifetime > 2) {
          this.enemyBullets.deactivate(i);
          continue;
        }
        if (b.collidesWith(this.player)) {
          this.setup();
        }
      }
      if (this.enemies.length === 0) {
        this.level += 1;
        return this.setup();
      }
    };

    Game.prototype.onKeyDown = function(key) {
      var angle;
      switch (key) {
        case 'w':
          this.player.angle.y -= 1;
          break;
        case 's':
          this.player.angle.y += 1;
          break;
        case 'a':
          this.player.angle.x -= 1;
          break;
        case 'd':
          this.player.angle.x += 1;
          break;
        case 'left':
          this.player.shooting.x -= 1;
          break;
        case 'right':
          this.player.shooting.x += 1;
          break;
        case 'up':
          this.player.shooting.y -= 1;
          break;
        case 'down':
          this.player.shooting.y += 1;
      }
      if (this.player.angle.x !== 0 || this.player.angle.y !== 0) {
        angle = Math.atan2(this.player.angle.y, this.player.angle.x);
        this.player.velocity.x = Math.cos(angle);
        return this.player.velocity.y = Math.sin(angle);
      } else {
        return this.player.velocity.x = this.player.velocity.y = 0;
      }
    };

    Game.prototype.onKeyUp = function(key) {
      var angle;
      switch (key) {
        case 'w':
          this.player.angle.y += 1;
          break;
        case 's':
          this.player.angle.y -= 1;
          break;
        case 'a':
          this.player.angle.x += 1;
          break;
        case 'd':
          this.player.angle.x -= 1;
          break;
        case 'left':
          this.player.shooting.x += 1;
          break;
        case 'right':
          this.player.shooting.x -= 1;
          break;
        case 'up':
          this.player.shooting.y += 1;
          break;
        case 'down':
          this.player.shooting.y -= 1;
      }
      if (this.player.angle.x !== 0 || this.player.angle.y !== 0) {
        angle = Math.atan2(this.player.angle.y, this.player.angle.x);
        this.player.velocity.x = Math.cos(angle);
        return this.player.velocity.y = Math.sin(angle);
      } else {
        return this.player.velocity.x = this.player.velocity.y = 0;
      }
    };

    Game.prototype.onPointStart = function(points) {
      var index, k, len, point, ref, ref1;
      for (index = k = 0, len = points.length; k < len; index = ++k) {
        point = points[index];
        if (this.leftTouchIndex === null && (0 < (ref = point.x) && ref < Vectr.WIDTH / 2)) {
          this.leftTouchIndex = index;
        }
        if (this.rightTouchIndex === null && (Vectr.WIDTH / 2 < (ref1 = point.x) && ref1 < Vectr.WIDTH)) {
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
        return this.rightStick.position.y = points[this.rightTouchIndex].y;
      }
    };

    Game.prototype.onPointMove = function(points) {
      var angle;
      if (this.leftTouchIndex !== null) {
        angle = Math.atan2(points[this.leftTouchIndex].y - this.leftStick.position.y, points[this.leftTouchIndex].x - this.leftStick.position.x);
        this.leftStick.rotation = angle;
        this.player.angle.x = Math.cos(angle);
        this.player.angle.y = Math.sin(angle);
      }
      if (this.rightTouchIndex !== null) {
        angle = Math.atan2(points[this.rightTouchIndex].y - this.rightStick.position.y, points[this.rightTouchIndex].x - this.rightStick.position.x);
        this.rightStick.rotation = angle;
        this.player.shooting.x = Math.cos(angle);
        return this.player.shooting.y = Math.sin(angle);
      }
    };

    Game.prototype.onPointEnd = function(points) {
      this.player.angle.x = this.player.angle.y = 0;
      this.player.shooting.x = this.player.shooting.y = 0;
      this.leftStick.active = false;
      this.leftTouchIndex = null;
      this.rightStick.active = false;
      return this.rightTouchIndex = null;
    };

    return Game;

  })(Vectr.Scene);
});
