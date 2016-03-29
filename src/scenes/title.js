/*
@description Title scene
 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr', 'buzz', 'cs!scenes/game'], function(Vectr, Buzz, Game) {
  var Title;
  return Title = (function(superClass) {
    extend(Title, superClass);

    function Title() {
      Title.__super__.constructor.call(this);
      this.clearColor = 'rgba(0, 0, 0, 0.25)';
      this.add(new Vectr.Label("YAJ↓RUSH↑", "40px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2));
    }

    Title.prototype.onKeyDown = function(key) {
      return Vectr.changeScene(Game);
    };

    Title.prototype.onPointStart = function(points) {
      return Vectr.changeScene(Game);
    };

    return Title;

  })(Vectr.Scene);
});
