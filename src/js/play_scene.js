'use strict';
const DEBUG = true;

var Point = require('./objects/point.js');

var GameObject = require('./objects/gameObject.js')
var Physical = require('./objects/physical.js');
var Bombable = require('./objects/bombable.js');

var Identifiable = require('./objects/identifiable.js');

var Player = require('./objects/player.js');
var Bomb = require('./objects/bomb.js');

var player, player2;

var wallGroup; //groups
var boxGroups;
var bombGroup;
var background;

var cursors;
var wasd;
var bombButton;
var bombButton2;
var bombButtonFF = false;
var bombButton2FF = false;

var toggleBoxCollisionButton; //just for debugging
var isBoxCollDisabled = false;
var toogleBoxCollisionButtonFF = false; //flip flop

const width = 800;
const height = 600;

var PlayScene = {

  isOdd:function (num) { return (num % 2) == 1;},
  //destBomb: function () { bomb.remove(bomb.children[0], true); },

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    //Controls
    cursors = this.game.input.keyboard.createCursorKeys();

    wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    bombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    bombButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

    toggleBoxCollisionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C); //debug

    //groups for tiles
    background = this.game.add.group();
    background.scale.setTo(1/1.2, 1/1.6);

    wallGroup = this.game.add.group();
    boxGroups = this.game.add.group();
    bombGroup = this.game.add.group();
    console.log(bombGroup);

    //player
    player = new Player(this.game, new Point(80, 40), 'player', new Point(1/1.2, 1/1.6),
    new Point(50, 60), new Point(-1, 28), false, 3, false, wasd, bombButton, bombButtonFF, 1, bombGroup,{});

    player2 = new Player(this.game, new Point(680, 520), 'player', new Point(1/1.2, 1/1.6),
    new Point(50, 60), new Point(-1, 28), false, 3, false, cursors, bombButton2, bombButton2FF, 1, bombGroup,{});

    //instead of a map.dat now we just insert them
    for (let i = - 25; i < width + 25; i += 50)
      for (let j = 0; j < height ; j += 40)
        background.add(new GameObject(this.game,
          new Point(i * 1.2, j * 1.6), 'background', new Point(1, 1)));

    for (let i = 25; i < width-25; i += 50) {
      for (let j = 0; j < height; j += 40) {
        if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
          //wall.create(i, j,'wall');
          wallGroup.add(new Physical(this.game,
             new Point(i, j), 'wall', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true));
        }
        if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
      || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))
        {
           boxGroups.add(new Bombable(this.game,
              new Point(i, j), 'box', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true, 1, false));
        }
      }
    }

    if (DEBUG) console.log("Loaded...", Date.now()-this.startTime, "ms");
    if (DEBUG) console.log("\n PLAYER: ", player.body);
    if (DEBUG) console.log("Player body height: ", player.body.height);
  },


  update: function(){
    this.game.physics.arcade.collide(player, wallGroup);
    this.game.physics.arcade.collide(player, boxGroups);

    this.game.physics.arcade.collide(player2, wallGroup);
    this.game.physics.arcade.collide(player2, boxGroups);

    this.game.world.bringToTop(player);
    this.game.world.bringToTop(player2);

    debugMode();

    //rest in player.update()
  },

  render: function(){
    if (isBoxCollDisabled) {
      //console.log(wall.children[5])
      this.game.debug.bodyInfo(player, 32, 32);
      this.game.debug.body(player);
      this.game.debug.body(boxGroups.children[5]);
      for (let i = 0; i < wallGroup.length; i++) {
          this.game.debug.body(wallGroup.children[i]);
      }
    }
  }

};

//shows hitboxes and allows movement through the boxes
var debugMode = function () {
  if(toggleBoxCollisionButton.isDown && !toogleBoxCollisionButtonFF)
  {
    if (!isBoxCollDisabled) {
      for (let i = 0; i < boxGroups.length; i++) {
        boxGroups.children[i].body.checkCollision.up = false;
        boxGroups.children[i].body.checkCollision.down = false;
        boxGroups.children[i].body.checkCollision.left = false;
        boxGroups.children[i].body.checkCollision.right = false;
      }
      isBoxCollDisabled = true;
    }
    else
      {
        for (let i = 0; i < boxGroups.length; i++) {
          boxGroups.children[i].body.checkCollision.up = true;
          boxGroups.children[i].body.checkCollision.down = true;
          boxGroups.children[i].body.checkCollision.left = true;
          boxGroups.children[i].body.checkCollision.right = true;
        }
        isBoxCollDisabled = false;
      }

    toogleBoxCollisionButtonFF = true;
  }
else if(!toggleBoxCollisionButton.isDown && toogleBoxCollisionButtonFF)
  toogleBoxCollisionButtonFF = false;
}

module.exports = PlayScene;
