'use strict';
const DEBUG = true;

var Map = require('./maps/map.js');

var Point = require('./objects/point.js');

var Identifiable = require('./objects/identifiable.js');

var Player = require('./objects/player.js');

var player, player2;
var map;

var wallGroup; //groups
var boxGroup;
var bombGroup;
var bgGroup;

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

//fit in res + space for Hud
const tileRes = 64; //64x64
const tileScale = new Point(0.75, 0.625); //64x64 to 48x40


var PlayScene = {

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
    bgGroup = this.game.add.group();
    wallGroup = this.game.add.group();
    boxGroup = this.game.add.group();
    bombGroup = this.game.add.group();

    //map
    map = new Map(this.game,1,1,bgGroup,wallGroup,boxGroup,bombGroup);

    //player
    player = new Player(this.game, new Point(88, 128), 'player', new Point(0.75, 0.625),
    new Point(60, 60), new Point(-8,  32), false, 3, false, wasd, bombButton, bombButtonFF, 1, bombGroup,{});

    if (DEBUG) console.log("Loaded...", Date.now()-this.startTime, "ms");
    if (DEBUG) console.log("\n PLAYER: ", player.body);
    if (DEBUG) console.log("Player body height: ", player.body.height);
  },


  update: function(){
    this.game.physics.arcade.collide(player, wallGroup);
    this.game.physics.arcade.collide(player, boxGroup);

    //this.game.physics.arcade.collide(player2, wallGroup);
    //this.game.physics.arcade.collide(player2, boxGroups);

    this.game.world.bringToTop(player);
    //this.game.world.bringToTop(player2);

    debugMode();

    //rest in player.update()
  },

  render: function(){
    if (isBoxCollDisabled) {
      //console.log(wall.children[5])
      this.game.debug.bodyInfo(player, 32, 32);
      this.game.debug.body(player);
      //this.game.debug.body(boxGroup.children[5]);

      for (let i = 0; i < wallGroup.length; i++)
          this.game.debug.body(wallGroup.children[i]);

      for (let i = 0; i < boxGroup.length; i++)
          this.game.debug.body(boxGroup.children[i]);
    }
  }

};

//shows hitboxes and allows movement through the boxes
var debugMode = function () {
  if(toggleBoxCollisionButton.isDown && !toogleBoxCollisionButtonFF)
  {
    if (!isBoxCollDisabled) {
      // for (let i = 0; i < boxGroup.length; i++) {
      //   boxGroup.children[i].body.checkCollision.up = false;
      //   boxGroup.children[i].body.checkCollision.down = false;
      //   boxGroup.children[i].body.checkCollision.left = false;
      //   boxGroup.children[i].body.checkCollision.right = false;
      // }
      isBoxCollDisabled = true;
    }
    else
      {
        // for (let i = 0; i < boxGroup.length; i++) {
        //   boxGroup.children[i].body.checkCollision.up = true;
        //   boxGroup.children[i].body.checkCollision.down = true;
        //   boxGroup.children[i].body.checkCollision.left = true;
        //   boxGroup.children[i].body.checkCollision.right = true;
        // }
        isBoxCollDisabled = false;
      }

    toogleBoxCollisionButtonFF = true;
  }
else if(!toggleBoxCollisionButton.isDown && toogleBoxCollisionButtonFF)
  toogleBoxCollisionButtonFF = false;
}

module.exports = PlayScene;
