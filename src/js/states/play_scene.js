'use strict';
const DEBUG = true;

var Point = require('../point.js');

var Groups = require('../groups.js')
var groups;
var Map = require('../maps/map.js');
var level;

var Player = require('../objects/player.js');
var player_0, player_1;
var playerBodySize = new Point(60, 60);
var playerBodyOffset = new Point(-8,  32);
var playerLives = 5;

//var Inputs = require('../inputs.js')
//var inputs_0;

//use inputs 0 or -1 for this?
var toggleBoxCollisionButton; //just for debugging
var isBoxCollDisabled = false;
var toogleBoxCollisionButtonFF = false; //flip flop

const width = 800;
const height = 600;

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    //map
    groups = new Groups (this.game); //first need the groups
    level = new Map(this.game,1,1,groups,tileData);

    //controls
    //inputs_0 = new Inputs(this.game, 0);
    toggleBoxCollisionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C); //debug

    //player //neads some extra offset cause of the body offset etc not finished
    //position should be fixed to the player number aswell as the sprite and inputs
    //player_0 = new Player(this.game, new Point(tileFixed.x+6, tileFixed.y-20), 'player', tileScale,
    //playerBodySize, playerBodyOffset, false, playerLives, false, inputs_0, 1, groups.bomb,{});

    player_0 = new Player(this.game, 0, tileData,
    playerBodySize, playerBodyOffset, false, playerLives, false, 1, groups.bomb,{});

    if (DEBUG) {
      console.log("Loaded...", Date.now()-this.startTime, "ms");
      console.log("\n PLAYER: ", player_0.body);
      console.log("\n MAP: ", level.map.squares);
    }
  },


  update: function(){

    //foreach player {do all this}

    this.game.physics.arcade.collide(player_0, groups.wall);
    this.game.physics.arcade.collide(player_0, groups.box);

    //this.game.physics.arcade.collide(player2, wallGroup);
    //this.game.physics.arcade.collide(player2, boxGroups);

    this.game.world.bringToTop(player_0);
    //this.game.world.bringToTop(player2);

    debugMode();

    //rest in player.update()
  },

  render: function(){
    if (isBoxCollDisabled) {
      //console.log(wall.children[5])
      this.game.debug.bodyInfo(player_0, 32, 32);
      this.game.debug.body(player_0);
      //this.game.debug.body(boxGroup.children[5]);

      for (let i = 0; i < groups.wall.length; i++)
          this.game.debug.body(groups.wall.children[i]);

      for (let i = 0; i < groups.box.length; i++)
          this.game.debug.body(groups.box.children[i]);
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
