'use strict';
const pvpMode = false;
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

const debugPos = config.debugPos;
const debugColor = config.debugColor;

const Point = require('../general/point.js');
const globalControls = require('../general/globalControls.js');
const pauseMenu = require('./pauseMenu.js');

const Groups = require('../general/groups.js');
var groups;

const Map = require('../maps/map.js');
var level;

var initialMap;
if (DEBUG) initialMap = config.initialMapPveDEBUG;
else initialMap = config.initialMapPve;

const Inputs = require('../general/inputs.js');
var gInputs; //global inputs

const Player = require('../player/player.js');
const initialPlayers = config.pve_initialPlayers;
const maxPlayers = config.pve_maxPlayers; //needed for the map generation
var players = [];

const tileData = config.tileData;

var music;

var mMenuTitle;
var livesHUD;
var livesHUD1;
var pointsHUD;
var pointsHUD1;
var HUDBg;
var HUDPoints;
var HUDPoints1;
var HUDBombHead = [];
var HUD2_0;
var HUD2_1;
var HUDBomb;
var HUDPressX;

var ffAnim = false;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

var TwoPlayers = false;
var deathCount = 0;


var PlayScene = {

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  toggleMute: function () { this.game.sound.mute = !this.game.sound.mute; },

  moreVol: function () { if(this.game.sound.volume < 1) this.game.sound.volume += 0.1; },

  lessVol: function () { if(this.game.sound.volume > 0.2) this.game.sound.volume -= 0.1; },

  create: function () {
    //music
    music = this.game.add.audio('music');
    music.loopFull(0.4); //la pauso que me morido quedo loco
    this.game.sound.mute = true;


    //menu stuff
    HUDBg = this.game.add.sprite(0, 0, 'HUDBg');

    HUDBombHead[0] = this.game.add.sprite(60, 10, 'player_0Clock');
    HUDBombHead[0].scale.setTo(0.75, 0.75);
    HUD2_0 = this.game.add.sprite(35+HUDBombHead[0].position.x, -5, 'HUD2');
    HUD2_0.scale.setTo(0.75, 0.75);
    HUDPoints = this.game.add.sprite(170, -5, 'HUDPoints');
    HUDPoints.scale.setTo(0.45, 0.7);

    HUDBomb = this.game.add.sprite(winWidth/2, 10, 'bomb');
    HUDBomb.anchor.setTo(0.5, 0);
    HUDBomb.scale.setTo(1.2, 1.2);

    HUDBombHead[1] = this.game.add.sprite(HUDBomb.position.x + 60, 10, 'player_1Clock');
    HUDBombHead[1].scale.setTo(0.75, 0.75);
    HUD2_1 = this.game.add.sprite(35+HUDBombHead[1].position.x, -5, 'HUD2');
    HUD2_1.scale.setTo(0.75, 0.75);
    HUDPoints1 = this.game.add.sprite(575, -5, 'HUDPoints');
    HUDPoints1.scale.setTo(0.45, 0.7);
    HUDPoints1.visible = false;

    livesHUD = this.game.add.text(HUD2_0.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD.anchor.setTo(0.2, 0);
    pointsHUD = this.game.add.text(HUDPoints.position.x + 133, 22, "",
    { font: "35px Comic Sans MS", fill: "#f9e000", align: "center" });
    pointsHUD.anchor.setTo(0.2, 0);

    livesHUD1 = this.game.add.text(HUD2_1.position.x + 42, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    livesHUD1.anchor.setTo(0.2, 0);
    livesHUD1.visible = false;
    pointsHUD1 = this.game.add.text(HUDPoints1.position.x + 133, 22, "",
    { font: "35px Comic Sans MS", fill: "#f9e000", align: "center"});
    pointsHUD1.anchor.setTo(0.2, 0);
    pointsHUD1.visible = false;

    HUDPressX = this.game.add.sprite(HUD2_1.position.x, -10, 'HUDPressX');
    HUDPressX.scale.setTo(0.75, 0.75);
    // HUDPressX.visible = false;

    muteMusicButton = this.game.add.button(10, 40, 'unmuted', this.toggleMute, this);
    muteMusicButton.scale.setTo(0.1, 0.1);
    mutedMusicButton = this.game.add.button(10, 40, 'muted', this.toggleMute, this);
    mutedMusicButton.scale.setTo(0.1, 0.1);

    lessVolButton = this.game.add.button(10, 10, 'volArrow', this.lessVol, this);
    lessVolButton.scale.setTo(0.04, 0.04);

    moreVolButton = this.game.add.button(30, 10, 'volArrow', this.moreVol, this);
    moreVolButton.anchor.setTo(1, 1);
    moreVolButton.scale.setTo(0.04, 0.04);
    moreVolButton.angle = 180;

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers, pvpMode);

    //global controls
    gInputs = new Inputs(this.game, -1);


    //player/s (initialPlayers)
    players = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      players.push(new Player(this.game, level, numPlayer, tileData, groups, HUDBombHead));
      players[numPlayer].restartCountdown(false);
    }


    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }

  },

  goToMainMenu: function (){ this.game.state.start('mainMenu'); },

  gmOver: function (){
     // var gmOverBg = this.game.add.sprite(0, 0, 'mMenuBG');
      var gmOverSign = this.game.add.sprite(winWidth/2, winHeight/2, 'gameOver');
      gmOverSign.anchor.setTo(0.5, 0.5);
      var goToMenu = this.game.add.button(winWidth, winHeight,
        'quitToMenu', this.goToMainMenu, this);
      goToMenu.anchor.setTo(1, 1);
  },


  update: function () {
    for(var i = 0; i < players.length; i++){
      if(players[i].lives <= 0 && deathCount<players.length)
        deathCount++;
    }

    if(deathCount === players.length){
        this.gmOver();
    }

    //No longer needed
    this.game.physics.arcade.collide(groups.player, groups.wall);
    this.game.physics.arcade.collide(groups.player, groups.box);
    this.game.physics.arcade.collide(groups.player, groups.bomb);


    if (players.length >= 2)
      TwoPlayers = true;
    else
      TwoPlayers = false;


    livesHUD.text = players[0].lives;
    pointsHUD.text = players[0].points;

    if(TwoPlayers === true){
      if(HUDPressX.visible){
        HUDPressX.visible = false;
        livesHUD1.visible = true;
        pointsHUD1.visible = true;
        HUDPoints1.visible = true;
      }
      livesHUD1.text = players[1].lives;
      pointsHUD1.text = players[1].points;
    }

    if(music.mute) muteMusicButton.visible = false;
    else   muteMusicButton.visible = true;
    if(!music.mute) mutedMusicButton.visible = false;
    else mutedMusicButton.visible = true;

    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    globalControls.addPlayerControl(gInputs, players, maxPlayers);
    globalControls.debugModeControl(gInputs, this.game, groups.player);
    globalControls.resetLevelControl(gInputs, level);
    globalControls.nextLevelControl(gInputs, level);
    pauseMenu.offPauseMenuControl(this.game, gInputs);

  },

  paused: function() {
    pauseMenu.pausedCreate(music, this.game);
  },

  resumed: function () {
    pauseMenu.resumedMenu(music, gInputs, this.game);
  },

  render: function () {
    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }
  },
};

module.exports = PlayScene;
