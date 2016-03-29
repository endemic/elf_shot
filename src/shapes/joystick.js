
/*
@description Shape for virtual joystick
 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr'], function(Vectr) {
  var Joystick;
  return Joystick = (function(superClass) {
    extend(Joystick, superClass);

    function Joystick(x, y) {
      Joystick.__super__.constructor.call(this, x, y);
      this.lineWidth = 5;
      this.size = 100;
    }

    Joystick.prototype.customPath = function(context) {
      context.beginPath();
      context.arc(0, 0, this.size / 2, 360, false);
      context.arc(0, 0, this.size / 4, 360, false);
      context.closePath();
      context.strokeStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
      return context.stroke();
    };

    return Joystick;

  })(Vectr.Shape);
});
