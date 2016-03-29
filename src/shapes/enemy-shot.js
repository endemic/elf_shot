/*
@description Enemy bullets. "Type" property corresponds to the enemy that shoots it.
shooter -> reflect
tracker -> homing
 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr'], function(Vectr) {
  var EnemyShot;
  return EnemyShot = (function(superClass) {
    extend(EnemyShot, superClass);

    function EnemyShot(x, y, type, target) {
      if (type == null) {
        throw new Error('EnemyShot requires a type argument.');
      }
      EnemyShot.__super__.constructor.call(this, x, y);
      this.target = target;
      this.type = type;
      this.lineWidth = 5;
      this.size = 4;
      this.speed = 400;
    }

    EnemyShot.prototype.update = function(delta) {
      var angle;
      EnemyShot.__super__.update.call(this, delta);
      this.lifetime += delta;

      /*
      			Shots that go off the edge of the screen are deactivated in the main game loop
       */
      switch (this.type) {
        case 'shooter':
          if (this.position.x + this.size / 2 > Vectr.WIDTH || this.position.x - this.size / 2 < 0) {
            this.velocity.x *= -1;
          }
          if (this.position.y + this.size / 2 > Vectr.HEIGHT || this.position.y - this.size / 2 < 0) {
            return this.velocity.y *= -1;
          }
          break;
        case 'tracker':
          angle = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x);
          this.velocity.x = Math.cos(angle);
          return this.velocity.y = Math.sin(angle);
      }
    };


    /*
    		@description Reset any properties so the projectile can be re-used
     */

    EnemyShot.prototype.reset = function() {
      return this.lifetime = 0;
    };

    return EnemyShot;

  })(Vectr.Shape);
});
