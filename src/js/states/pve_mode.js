'use strict';
const DEBUG = true;

var Point = require('../general/point.js');
var globalControls = require('../general/globalControls.js');

var Groups = require('../general/groups.js');
var groups;
var Map = require('../maps/map.js');
var level;
var initialMap = { world: 0, level: 0 };

var Inputs = require('../general/inputs.js');
var gInputs; //global inputs

var Player = require('../player/player.js');
var players = []; //2 max for this mode but meh
var initialPlayers = 1;
var maxPlayers = 4; //needed for the map generation

var music;

const width = 800;
const height = 600;
const debugPos = new Point(32, height - 96);
const debugColor = "yellow";

const tileData = {
  Res: new Point(64, 64),
  Scale: new Point(0.75, 0.625), //64x64 to 48x40
  Offset: new Point(40, 80), //space for hud
};

var mMenuTitle;
var livesHUD;

var pausePanel;
var unpauseButton;
var gotoMenuButton;

var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {
    //menu stuff
    mMenuTitle = this.game.add.sprite(50, 0, 'mMenuTitle'); //vital for life on earth
    mMenuTitle.scale = new Point(0.4, 0.75); //nah just for presentation


    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //music
    music = this.game.add.audio('music');
    //music.loopFull(); //la pauso que me morido quedo loco

    //player/s (initialPlayers)
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      players.push(new Player(this.game, level, numPlayer, tileData, groups));
      players[numPlayer].startCountdown();
    }

    livesHUD = this.game.add.text(width/2, height/2, players[0].playerLives,
        { font: "65px Arial", fill: "#f9e000", align: "center"});

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },


  update: function () {

    //No longer needed
    // this.game.physics.arcade.collide(groups.player, groups.wall);
    // if (!gInputs.debug.state) {
    //   this.game.physics.arcade.collide(groups.player, groups.box);
    //   this.game.physics.arcade.collide(groups.player, groups.bomb);
    // }
    // else this.game.physics.arcade.collide(players[0], groups.enemy);

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.addPlayerControl(gInputs, players, maxPlayers);
    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
    globalControls.nextLevelControl(gInputs, level);
    offPauseMenuControl(this.game);
  },

  paused: function () {
    music.pause();
    this.game.stage.disableVisibilityChange = true;
    this.game.input.onDown.add(unPause, this);

    pausePanel = this.game.add.sprite(width / 2, height / 2, 'pausePanel');
    pausePanel.anchor.setTo(0.5, 0.5);
    pausePanel.alpha = 0.5;

    unpauseButton = this.game.add.sprite(width / 2, height / 2 - 50, 'mMenuButton2');
    unpauseButton.anchor.setTo(0.5, 0.5);

    gotoMenuButton = this.game.add.sprite(width / 2, height / 2 + 50, 'quitToMenu');
    gotoMenuButton.anchor.setTo(0.5, 0.5);

    function unPause() {
      if (this.game.paused) {
        if (this.game.input.mousePointer.position.x > unpauseButton.position.x - unpauseButton.texture.width / 2
          && this.game.input.mousePointer.position.x < unpauseButton.position.x + unpauseButton.texture.width / 2
          && this.game.input.mousePointer.position.y > unpauseButton.position.y - unpauseButton.texture.height / 2
          && this.game.input.mousePointer.position.y < unpauseButton.position.y + unpauseButton.texture.height / 2)
          this.game.paused = false;

        //We need to fix the remake of maps before this fully works. But it does what it has to.
        else if (this.game.input.mousePointer.position.x > gotoMenuButton.position.x - gotoMenuButton.texture.width / 2
          && this.game.input.mousePointer.position.x < gotoMenuButton.position.x + gotoMenuButton.texture.width / 2
          && this.game.input.mousePointer.position.y > gotoMenuButton.position.y - gotoMenuButton.texture.height / 2
          && this.game.input.mousePointer.position.y < gotoMenuButton.position.y + gotoMenuButton.texture.height / 2)
          { this.game.state.start('mainMenu'); this.game.paused = false; }
      }
    };

  },

  //NOT FULLY NECESSARY BUT MAY BE USEFUL IN THE FUTURE
  // pauseUpdate: function () {
  //  // console.log(this);

  //   //if(gInputs)
  //     // console.log(gInputs);
  //     // gInputs.pMenu.ff = false;
  //   // onPauseMenuControl(this.game);

  //   // console.log(gInputs.pMenu.ff)
  // },

  resumed: function () {
    music.resume();
    this.game.stage.disableVisibilityChange = false;
    gInputs.pMenu.ff = false;

    pausePanel.destroy();
    unpauseButton.destroy();
    gotoMenuButton.destroy();
  },

  render: function () {

    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }

  },
};


var offPauseMenuControl = function (game) {
  if (gInputs.pMenu.button.isDown && !gInputs.pMenu.ff) {
    gInputs.pMenu.ff = true;
    game.paused = true;
  }
  //MIRAR DOCUMENTACION DE PHASER.SIGNAL
  else if (gInputs.pMenu.isUp)
    gInputs.pMenu.ff = false;
  //console.log(gInputs.pMenu.ff)
}

module.exports = PlayScene;
