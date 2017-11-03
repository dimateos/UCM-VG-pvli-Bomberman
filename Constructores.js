function Point(x, y) {
    this.x = x;
    this.y = y;
  }

function gameObject (graphic, position) { //GO contructor
  this._graphic = graphic;
  this._position = position;
}
gameObject.prototype.draw = function () {}; //the only common function


//dos clases hijas de GO, diferentes
function solid(graphic, position) {
gameObject.apply(this, [graphic, position]);
}
solid.prototype = Object.create(gameObject.prototype); //link the prototypes
solid.prototype.constructor = solid;                   //correct the property
solid.prototype.beSolid = function () {};              //specific solid behavior

function identifiable(graphic, position, id) {
    gameObject.apply(this, [graphic, position]);
    this.id=id;
}
identifiable.prototype = Object.create(gameObject.prototype);
identifiable.prototype.constructor = identifiable;


//clases a añadir lateralmente
function bombable(lives) {
    this.lives = lives;
}
bombable.prototype.beBombable = function () {};

//hija de bombable
function mobile(lives, vel, dir) {
    bombable.apply(this, [lives]);
    this.vel = vel;
    this.dir = dir;
}
mobile.prototype = Object.create(bombable.prototype);
mobile.prototype.constructor = mobile;
mobile.prototype.translate = function () {};


//dos clases hijas de mobile, diferentes
function player(lives, vel, dir, mods) {
    mobile.apply(this, [lives, vel, dir]);
    this.mods = mods;
}
player.prototype = Object.create(mobile.prototype);
player.prototype.constructor = player;
player.prototype.input = function () {};

function enemy(lives, vel, dir) {
    mobile.apply(this, [lives, vel, dir]);
}
enemy.prototype = Object.create(player.prototype);
enemy.prototype.constructor = enemy;
player.prototype.move = function () {};
