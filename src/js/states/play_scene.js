'use strict';
const DEBUG = true;

var Point = require('../point.js');

var Groups = require('../groups.js')
var groups;
var Map = require('../maps/map.js');
var level;

var Inputs = require('../inputs.js');
var gInputs; //global inputs

var Player = require('../objects/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 1;
var maxPlayers = 4; //needed for the map generation

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
    level = new Map(this.game, 1, 1, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs (this.game, -1);

    //player/s (initialPlayers)
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups.bomb,{}));

    if (DEBUG) {
      console.log("Loaded...", Date.now()-this.startTime, "ms");
      console.log("\n PLAYER: ", players[0].body);
      console.log("\n MAP: ", level.map.squares);
    }
  },


  update: function(){

    //maybe in some object update?
    for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
      this.game.physics.arcade.collide(players[numPlayer], groups.wall);

      if (!gInputs.debug.state) {
        this.game.physics.arcade.collide(players[numPlayer], groups.box);
        this.game.physics.arcade.collide(players[numPlayer], groups.bomb);
      }

      this.game.world.bringToTop(players[numPlayer]);
    }

    addPlayerControl(this.game);
    debugModeControl(this.game);
    pauseMenuControl(this.game);

    //rest in player and bomb updates etc
  },


  render: function(){

    //only debugging stuff atm
    if (gInputs.debug.state) {
      this.game.debug.bodyInfo(players[0], 32, 32);
      this.game.debug.body(players[0]);

      for (let i = 0; i < groups.bomb.length; i++)
        this.game.debug.body(groups.bomb.children[i]);

      for (let i = 0; i < groups.wall.length; i++)
        this.game.debug.body(groups.wall.children[i]);

      for (let i = 0; i < groups.box.length; i++)
        this.game.debug.body(groups.box.children[i]);
    }
  }

};

//this two methods may could go into some globalInputs.js update? but seems good
//allow to add extra players
var addPlayerControl = function (game) {
  if(gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers)
  {
    gInputs.addPlayer.ff = true;

    //logic for new player
    for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
      //divides by 2 all players' lives (integers)
      players[numPlayer].lives -= players[numPlayer].lives % 2;
      players[numPlayer].lives /= 2;
    }
    players.push(new Player (game, players.length, tileData, groups.bomb,{}))
    players[players.length-1].lives = players[0].lives;
    //new player's lives = player0; maybe a little unfair, but the real mode only allows 2 players
  }

  else if(gInputs.addPlayer.button.isUp)
    gInputs.addPlayer.ff = false;
};

//shows hitboxes and allows movement through the boxes
var debugModeControl = function (game) {
  if(gInputs.debug.button.isDown && !gInputs.debug.ff)
  {
    gInputs.debug.state = !gInputs.debug.state; //toggle state
    gInputs.debug.ff = true;

    if (!gInputs.debug.state) game.debug.reset(); //reset debug
  }

  else if(gInputs.debug.button.isUp)
    gInputs.debug.ff = false;
  
};

var pauseMenuControl = function (game) {
  if(gInputs.pMenu.button.isDown && !gInputs.pMenu.ff)
  {
    gInputs.pMenu.ff = true;
    game.paused = !game.paused;
  }
//MIRAR DOCUMENTACION DE PHASER.SIGNAL
  else if(game.onPause || game.onResume)
    gInputs.pMenu.ff = false;
  console.log(gInputs.pMenu.ff)
}

module.exports = PlayScene;
