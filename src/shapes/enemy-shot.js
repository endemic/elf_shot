(function (root) {
    'use strict';

    /*
    @description Enemy bullets. "Type" property corresponds to the enemy that shoots it.
    shooter -> reflect
    tracker -> homing
     */
    function EnemyShot(options) {
        Arcadia.Shape.call(this, options);
        this.lineWidth = 5;
        this.size = {width: 4, height: 4};
        this.speed = 400;
    }

    EnemyShot.prototype.update = function (delta) {
        var angle;
        Arcadia.Shape.prototype.update.call(this, delta);

        this.lifetime += delta;

        /*
          Shots that go off the edge of the screen are deactivated in the main game loop
         */
        switch (this.type) {
            // Reflects off boundaries
            case 'shooter':
                if (this.position.x + this.size / 2 > Arcadia.WIDTH || this.position.x - this.size / 2 < 0) {
                    this.velocity.x *= -1;
                }
                if (this.position.y + this.size / 2 > Arcadia.HEIGHT || this.position.y - this.size / 2 < 0) {
                    this.velocity.y *= -1;
                }
                break;
            // Homes in on target
            case 'tracker':
                angle = Math.atan2(this.target.position.y - this.position.y, this.target.position.x - this.position.x);
                this.velocity.x = Math.cos(angle);
                this.velocity.y = Math.sin(angle);
        }
    };


    /*
      @description Reset any properties so the projectile can be re-used
     */

    EnemyShot.prototype.reset = function () {
        this.lifetime = 0;
    };

    root.EnemyShot = EnemyShot;
}(window));
