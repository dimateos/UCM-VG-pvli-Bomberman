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
var players = []; //2 max for this mode
var maxPlayers = 2; //needed for the map generation

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

    //player
    players[0] = new Player(this.game, 0, tileData, groups.bomb,{}); //only one at start

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

    debugModeControl(this.game);

    //rest in player and bomb updates etc
  },


  render: function(){
    //only debugging stuff
    if (gInputs.debug.state) {
      this.game.debug.bodyInfo(players[0], 32, 32);
      this.game.debug.body(players[0]);

      for (let i = 0; i < groups.wall.length; i++)
        this.game.debug.body(groups.wall.children[i]);

      for (let i = 0; i < groups.box.length; i++)
        this.game.debug.body(groups.box.children[i]);
    }
  }

};

//shows hitboxes and allows movement through the boxes
var debugModeControl = function (game) {
  if(gInputs.debug.button.isDown && !gInputs.debug.ff)
  {
    gInputs.debug.state = !gInputs.debug.state;
    gInputs.debug.ff = true;
    if (!gInputs.debug.state) game.debug.reset();
  }

  else if(gInputs.debug.button.isUp)
    gInputs.debug.ff = false;
}

module.exports = PlayScene;
