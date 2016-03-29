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
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr'], function(Vectr) {
  var Enemy, distance;
  distance = function(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  };
  return Enemy = (function(superClass) {
    extend(Enemy, superClass);

    function Enemy(x, y, type) {
      Enemy.__super__.constructor.call(this, x, y);
      this.shape = 'square';
      this.type = type != null ? type : 'drone';
      switch (this.type) {
        case 'drone':
          this.color = this.originalColor = {
            red: 255,
            green: 0,
            blue: 50,
            alpha: 1
          };
          this.size = 35;
          this.speed = this.originalSpeed = 75;
          this.solid = true;
          this.lineWidth = 3;
          break;
        case 'shooter':
          this.color = this.originalColor = {
            red: 50,
            green: 255,
            blue: 50,
            alpha: 1
          };
          this.size = 30;
          this.speed = this.originalSpeed = 100;
          this.solid = true;
          this.lineWidth = 3;
          break;
        case 'mine':
          this.shape = 'circle';
          this.color = this.originalColor = {
            red: 0,
            green: 255,
            blue: 0,
            alpha: 0.5
          };
          this.size = 20;
          this.speed = this.originalSpeed = 0;
          this.solid = true;
          this.lineWidth = 3;
      }
      this.rotation = 270 * 180 / Math.PI;
      this.counter = 0;
      this.cycle = 1;
      this.shooting = false;
    }

    Enemy.prototype.update = function(delta) {
      Enemy.__super__.update.call(this, delta);
      switch (this.type) {
        case 'drone':
          this.color.blue += this.cycle;
          if (this.color.blue > 255 || this.color.blue < 50) {
            this.cycle *= -1;
          }
          this.counter += delta;
          if (this.counter > 3 && this.speed < 145) {
            this.speed += 1;
          }
          if (this.target != null) {
            this.rotation = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x);
            this.velocity.x = Math.cos(this.rotation);
            this.velocity.y = Math.sin(this.rotation);
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
          this.color.alpha -= this.cycle / 255;
          if (this.color.alpha >= 0.5 || this.color.alpha < 0.1) {
            this.cycle *= -1;
          }
      }
      if (this.position.x + this.size / 2 > Vectr.WIDTH) {
        this.position.x = Vectr.WIDTH - this.size / 2;
      }
      if (this.position.x - this.size / 2 < 0) {
        this.position.x = this.size / 2;
      }
      if (this.position.y + this.size / 2 > Vectr.HEIGHT) {
        this.position.y = Vectr.HEIGHT - this.size / 2;
      }
      if (this.position.y - this.size / 2 < 0) {
        return this.position.y = this.size / 2;
      }
    };

    Enemy.prototype.reset = function() {
      this.color = this.originalColor;
      this.speed = this.originalSpeed;
      this.counter = 0;
      return this.shooting = false;
    };

    return Enemy;

  })(Vectr.Shape);
});
