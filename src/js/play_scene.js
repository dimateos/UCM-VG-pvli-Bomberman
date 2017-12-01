'use strict';
const DEBUG = true;

var Point = require('./objects/point.js');

var GameObject = require('./objects/gameObject.js')
var Physical = require('./objects/physical.js');
var Bombable = require('./objects/bombable.js');

var Identifiable = require('./objects/identifiable.js');

var Player = require('./objects/player.js');
var Bomb = require('./objects/bomb.js');

var player;

var wall; //groups
var box;
var bomb;
var background;

var cursors;
var wasd;
var bombButton;
var onceButtonBomb = false;

var toggleBoxCollisionButton; //just for debugging
var isBoxCollDisabled = false;
var onceButtonDebug = false;

const width = 800;
const height = 600;

var PlayScene = {

  isOdd:function (num) { return (num % 2) == 1;},
  destBomb: function () { bomb.remove(bomb.children[0], true); },

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    player = new Player(this.game, new Point(80, 40), 'player', new Point(1/1.2, 1/1.6),
    new Point(50, 60), new Point(-1, 28), false, 3, false, {}, 1, {});

    //groups for tiles
    background = this.game.add.group();
    wall = this.game.add.physicsGroup();
    box = this.game.add.physicsGroup();
    bomb = this.game.add.physicsGroup();

    background.scale.setTo(1/1.2, 1/1.6);
    bomb.scale.setTo(1/1.2, 1/1.6);

    //instead of a map.dat now we just insert them
    for (let i = - 25; i < width + 25; i += 50)
      for (let j = 0; j < height ; j += 40)
        background.add(new GameObject(this.game,
          new Point(i * 1.2, j * 1.6), 'background', new Point(1, 1)));

    for (let i = 25; i < width-25; i += 50) {
      for (let j = 0; j < height; j += 40) {
        if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
          //wall.create(i, j,'wall');
          wall.add(new Physical(this.game,
             new Point(i, j), 'wall', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true));
        }
        if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
      || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))
        {
          box.add(new Bombable(this.game,
             new Point(i, j), 'box', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true, 1, false));
        }
      }
    }

    //Controls
    cursors = this.game.input.keyboard.createCursorKeys();

    wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    bombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    toggleBoxCollisionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C);

    if (DEBUG) console.log("Loaded...", Date.now()-this.startTime, "ms");
    if (DEBUG) console.log("\n PLAYER: ", player.body);
    if (DEBUG) console.log("Player body height: ", player.body.height);
  },


  update: function(){
    this.game.physics.arcade.collide(player, wall);
    this.game.physics.arcade.collide(player, box);
    this.game.world.bringToTop(player);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //Player MOVEMENT
    if (cursors.left.isDown || wasd.left.isDown) {
      player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown || wasd.right.isDown) {
      player.body.velocity.x = 250;
    }
    if (cursors.up.isDown || wasd.up.isDown) {
      player.body.velocity.y = -250;
    }
    else if (cursors.down.isDown || wasd.down.isDown){
      player.body.velocity.y = 250;
    }

    //BOMB
    if(bombButton.isDown && !onceButtonBomb){
      bomb.create(player.centerX*1.2-24,player.centerY*1.6-12,'bomb');
      this.game.time.events.add(3000, this.destBomb, this);
      onceButtonBomb = true;
    }
    else if(!bombButton.isDown && onceButtonBomb) //deploy 1 bomb each time
      onceButtonBomb = false;

      debugMode();
  },

  render: function(){
    if (isBoxCollDisabled) {
      //console.log(wall.children[5])
      this.game.debug.bodyInfo(player, 32, 32);
      this.game.debug.body(player);
      this.game.debug.body(box.children[5]);
      for (let i = 0; i < wall.length; i++) {
          this.game.debug.body(wall.children[i]);
      }
    }
  }

};

//shows hitboxes and allows movement through the boxes
var debugMode = function () {
  if(toggleBoxCollisionButton.isDown && !onceButtonDebug)
  {
    if (!isBoxCollDisabled) {
      for (let i = 0; i < box.length; i++) {
        box.children[i].body.checkCollision.up = false;
        box.children[i].body.checkCollision.down = false;
        box.children[i].body.checkCollision.left = false;
        box.children[i].body.checkCollision.right = false;
      }
      isBoxCollDisabled = true;
    }
    else
      {
        for (let i = 0; i < box.length; i++) {
          box.children[i].body.checkCollision.up = true;
          box.children[i].body.checkCollision.down = true;
          box.children[i].body.checkCollision.left = true;
          box.children[i].body.checkCollision.right = true;
        }
        isBoxCollDisabled = false;
      }

    onceButtonDebug = true;
  }
else if(!toggleBoxCollisionButton.isDown && onceButtonDebug)
  onceButtonDebug = false;
}

module.exports = PlayScene;
