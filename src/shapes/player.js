/*
@description Shape for player avatar
 */
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['vectr'], function(Vectr) {
  var Player;
  return Player = (function(superClass) {
    extend(Player, superClass);

    function Player(x, y) {
      Player.__super__.constructor.call(this, x, y);
      this.shape = 'triangle';
      this.size = 40;
      this.speed = 150;
      this.lineWidth = 3;
      this.rotation = 270 * 180 / Math.PI;
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

    Player.prototype.customPath = function(context) {
      context.beginPath();
      context.arc(1, 0, this.size / 2, 360, false);
      context.moveTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
      context.lineTo(this.size / 2 * Math.cos(120 * Math.PI / 180), this.size / 2 * Math.sin(120 * Math.PI / 180));
      context.lineTo(-this.size / 10, 0);
      context.lineTo(this.size / 2 * Math.cos(240 * Math.PI / 180), this.size / 2 * Math.sin(240 * Math.PI / 180));
      context.lineTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
      context.closePath();
      context.strokeStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
      return context.stroke();
    };

    Player.prototype.update = function(delta) {
      Player.__super__.update.call(this, delta);
      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
      }
      if (this.shooting.x !== 0 || this.shooting.y !== 0) {
        this.rotation = Math.atan2(this.shooting.y, this.shooting.x);
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

    return Player;

  })(Vectr.Shape);
});

Run
Link

Annotated Source

CoffeeScript is a little language that compiles into JavaScript. Underneath that awkward Java-esque patina, JavaScript has always had a gorgeous heart. CoffeeScript is an attempt to expose the good parts of JavaScript in a simple way.

The golden rule of CoffeeScript is: "It's just JavaScript". The code compiles one-to-one into the equivalent JS, and there is no interpretation at runtime. You can use any existing JavaScript library seamlessly from CoffeeScript (and vice-versa). The compiled output is readable and pretty-printed, will work in every JavaScript runtime, and tends to run as fast or faster than the equivalent handwritten JavaScript.

Latest Version: 1.10.0

npm install -g coffee-script

Overview

CoffeeScript on the left, compiled JavaScript output on the right.

# Assignment:
number   = 42
opposite = true

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5]

# Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

# Splats:
race = (winner, runners...) ->
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)

var cubes, list, math, num, number, opposite, race, square,
  slice = [].slice;

number = 42;

opposite = true;

if (opposite) {
  number = -42;
}

square = function(x) {
  return x * x;
};

list = [1, 2, 3, 4, 5];

math = {
