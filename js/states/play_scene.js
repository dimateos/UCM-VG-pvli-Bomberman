'use strict';
const DEBUG = true;

var Point = require('../point.js');

var Groups = require('../groups.js')
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = {world: 1, level: 1};

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

var mMenuTitle;
var pausePanel;
var flipflop = false;
var pauseButton;

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    mMenuTitle = this.game.add.sprite(50,0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.9, 0.75); //nah just for presentation

    
    
    //map
    groups = new Groups (this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs (this.game, -1);

    //player/s (initialPlayers) //maybe player group instead?
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups));

    if (DEBUG) {
      console.log("Loaded...", Date.now()-this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

    
  },


  update: function(){

    //No longer needed
    // this.game.physics.arcade.collide(groups.player, groups.wall);
    // if (!gInputs.debug.state) {
    //   this.game.physics.arcade.collide(groups.player, groups.box);
    //   this.game.physics.arcade.collide(groups.player, groups.bomb);
    // }
    // else this.game.physics.arcade.collide(players[0], groups.enemy);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player);

    //but full array bringToTop doesnt work
    //for (var numPlayer = 0; numPlayer < players.length; numPlayer++)
      //this.game.world.bringToTop(players[numPlayer]);

    addPlayerControl(this.game);
    debugModeControl(this.game);
    offPauseMenuControl(this.game);
  },

  paused: function(){
    this.game.input.onDown.add(unPause, this);
    gInputs.pMenu.ff = false;
    pausePanel = this.game.add.sprite(width/2, height/2, 'pausePanel');
    pausePanel.anchor.setTo(0.5, 0.5);
    pausePanel.alpha = 0.5;

    pauseButton = this.game.add.sprite(width/2, height/2, 'mMenuButton2');
    pauseButton.anchor.setTo(0.5, 0.5);

    function unPause(){
      console.log(this.game.input.mousePointer.position.x);
      if(this.game.paused){
        if(this.game.input.mousePointer.position.x > pauseButton.position.x - pauseButton.texture.width/2 
          && this.game.input.mousePointer.position.x < pauseButton.position.x + pauseButton.texture.width/2 
          && this.game.input.mousePointer.position.y > pauseButton.position.y - pauseButton.texture.height/2 
          && this.game.input.mousePointer.position.y < pauseButton.position.y + pauseButton.texture.height/2)
          this.game.paused = false;
      }
    };

  },

  pauseUpdate: function () {
   // console.log(this);
    
    //if(gInputs)
      // console.log(gInputs);
      // gInputs.pMenu.ff = false;
    // onPauseMenuControl(this.game);
    
    // console.log(gInputs.pMenu.ff)
  },

  render: function(){
    if (gInputs.debug.state) {
      groups.drawDebug();
      this.game.debug.bodyInfo(players[0], 32, 32);
    }
  },


  
};



var onPauseMenuControl = function (game){
  if(gInputs.pMenu.isUp)
    gInputs.pMenu.ff = false;

  else if(gInputs.pMenu.button.isDown && !gInputs.pMenu.ff)
  {
    gInputs.pMenu.ff = true;
    game.paused = false;
  }
}

var offPauseMenuControl = function (game) {
  if(gInputs.pMenu.button.isDown && !gInputs.pMenu.ff)
  {
    gInputs.pMenu.ff = true;
    game.paused = true;
  }
//MIRAR DOCUMENTACION DE PHASER.SIGNAL
  else if(gInputs.pMenu.isUp)
    gInputs.pMenu.ff = false;
  console.log(gInputs.pMenu.ff)
}

//this two methods may could go into some globalInputs.js update? but seems good
//allow to add extra players
var addPlayerControl = function (game) {
  if(gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers)
  {
    gInputs.addPlayer.ff = true;

    console.log(groups.enemy.children)

    //logic for new player
    for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
      //divides by 2 all players' lives (integers) but only down to 1
      if (players[numPlayer].lives > 1) {
        players[numPlayer].lives -= players[numPlayer].lives % 2;
        players[numPlayer].lives /= 2;
      }
    }
    players.push(new Player (game, level, players.length, tileData, groups))
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
    //while debug player 0 is invecible and can push enemies
    players[0].invencible = true;

    gInputs.debug.state = !gInputs.debug.state; //toggle state
    gInputs.debug.ff = true;

    if (!gInputs.debug.state) {
      players[0].endInvencibility();
      game.debug.reset(); //reset whole debug render
    }
  }

  else if(gInputs.debug.button.isUp)
    gInputs.debug.ff = false;

};


module.exports = PlayScene;
