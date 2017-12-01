'use strict';

var  Bombable = require('./bombable.js');
var Bomb = require('./bomb.js')

function Player (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, input, bombButton, bombButtonFF, bombs, bombGroup, mods) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    this.bombs = bombs;
    this.mods = mods;
    this.input = input;

    this.bombButtonFF = bombButtonFF;
    this.bombButton = bombButton;
    this.bombGroup = bombGroup;
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    //MOVEMENT
    if (this.input.left.isDown) {
      this.body.velocity.x = -250;
    }
    else if (this.input.right.isDown) {
        this.body.velocity.x = 250;
    }
    if (this.input.up.isDown) {
        this.body.velocity.y = -250;
    }
    else if (this.input.down.isDown){
        this.body.velocity.y = 250;
    }

    //BOMB
    if(this.bombButton.isDown && !this.bombButtonFF){
        this.bombGroup.add(new Bomb (this.game, {x: this.position.x, y: this.position.y+22},
            'bomb', this.scale, {x: 64, y: 64}, {x: 0, y: 0}, true, 1, false, 3000, 1, this.bombGroup));

        this.bombButtonFF = true;
    }
    else if(this.bombButton.isUp) //deploy 1 bomb each time
        this.bombButtonFF = false;

}

module.exports = Player;
