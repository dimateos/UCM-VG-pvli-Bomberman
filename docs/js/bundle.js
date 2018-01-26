(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Audio control buttons data
const muteMusicButtonPos = config.muteMusicButtonPos;
const muteMusicButtonScale = config.mutedMusicButtonScale;
const mutedMusicButtonPos = config.mutedMusicButtonPos;
const mutedMusicButtonScale = config.mutedMusicButtonScale;
const lessVolButtonPos = config.lessVolButtonPos;
const lessVolButtonScale = config.lessVolButtonScale;
const moreVolButtonPos = config.moreVolButtonPos;
const moreVolButtonScale = config.moreVolButtonScale;
const moreVolButtonAnchor = config.moreVolButtonAnchor;
const moreVolButtonAngle = config.moreVolButtonAngle;

//Audio variables
const defaultVolume = config.default_volume;
const volume_increment = config.volume_increment;
const volume_Max = config.volume_Max;
const volume_Min = config.volume_Min;

//Audio control buttons (this is not constructed object)
var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

//Initial audio setup
var muted = config.default_muted;

//contains all the functions to draw/control audio
var audioHUD = {

    music: {}, //container

    //Adds the music and sets it up to loop forever
    init: function (game) {

        this.music = game.add.audio('music');
        this.music.loopFull(0.4);
        game.sound.volume = defaultVolume;
        game.sound.mute = muted; //muted default or not
    },

    //Creation of the buttons
    creation: function (game) {

        muteMusicButton = game.add.button(muteMusicButtonPos.x, muteMusicButtonPos.y, 'unmuted', this.toggleMute, game);
        muteMusicButton.scale.setTo(muteMusicButtonScale.x, muteMusicButtonScale.y);
        mutedMusicButton = game.add.button(mutedMusicButtonPos.x, mutedMusicButtonPos.y, 'muted', this.toggleMute, game);
        mutedMusicButton.scale.setTo(mutedMusicButtonScale.x, mutedMusicButtonScale.y);

        lessVolButton = game.add.button(lessVolButtonPos.x, lessVolButtonPos.y, 'volArrow', this.lessVol, game);
        lessVolButton.scale.setTo(lessVolButtonScale.x, lessVolButtonScale.y);

        moreVolButton = game.add.button(moreVolButtonPos.x, moreVolButtonPos.y, 'volArrow', this.moreVol, game);
        moreVolButton.anchor.setTo(moreVolButtonAnchor.x, moreVolButtonAnchor.y);
        moreVolButton.scale.setTo(moreVolButtonScale.x, moreVolButtonScale.y);
        moreVolButton.angle = moreVolButtonAngle; //inversed

    },

    //Destruction of the music. Called when coming back to the Main Menu
    destruction: function (game) {
        muted = game.sound.mute;
        this.music.destroy();
    },

    //Swaps visibility of the mute button
    checkVisible: function () {
        if (this.music.mute) muteMusicButton.visible = false;
        else muteMusicButton.visible = true;

        if (!this.music.mute) mutedMusicButton.visible = false;
        else mutedMusicButton.visible = true;
    },

    //Game is the context in all this functions
    //Toggles mute
    toggleMute: function () { this.sound.mute = !this.sound.mute; },

    //Increases volume
    moreVol: function () {
        if (!this.sound.mute && this.sound.volume < volume_Max)
            this.sound.volume += volume_increment;
    },

    //Decreases volume
    lessVol: function () {
        if (!this.sound.mute && this.sound.volume > volume_Min)
            this.sound.volume -= volume_increment;
    },
}

module.exports = audioHUD;

},{"../config.js":6}],2:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Bomb HUD objects' data
const HUDBombPos = config.HUDBombPos;
const HUDBombAnchor = config.HUDBombAnchor;
const HUDBombScale = config.HUDBombScale;

const HUDFlameOffset = config.HUDFlameOffset;
const HUDFlameScale = config.HUDFlameScale;

const HUDBombPosText = config.HUDBombPosText;
const HUDBombPosOffset = config.HUDBombPosOffset;


//Bomb HUD constructor (countdown in pvp or lvl count in pve)
var bombHUD = function (game, pvpMode) {

    var posX; //different for the modes
    if (pvpMode) posX = winWidth - winWidth / 10;
    else posX = winWidth / 2;

    //animated flame
    this.HUDFlame = game.add.sprite(posX + HUDBombPos.x, HUDBombPos.y + HUDFlameOffset.y, config.keys.flame);
    this.HUDFlame.anchor.setTo(HUDBombAnchor.x, HUDBombAnchor.y);
    this.HUDFlame.scale.setTo(HUDFlameScale.x, HUDFlameScale.y);
    this.HUDFlame.animations.add("flaming", [0, 1, 2, 3, 4], 9, true);
    this.HUDFlame.animations.play("flaming");

    //bomb over it
    this.HUDBomb = game.add.sprite(posX + HUDBombPos.x, HUDBombPos.y, config.keys.bomb);
    this.HUDBomb.anchor.setTo(HUDBombAnchor.x, HUDBombAnchor.y);
    this.HUDBomb.scale.setTo(HUDBombScale.x, HUDBombScale.y);
    this.HUDBomb.animations.add("red");
    this.HUDBomb.animations.add("static", [0]);

    //flip flops (so no callbacks)
    this.HUDBombTextFF = false;
    this.HUDBombFF = false;

    //add the text
    if (config.endless_rnd_map_gen || pvpMode) {
        if (pvpMode) posX += HUDBombPosOffset.x;
        this.HUDBombText = game.add.text(posX + HUDBombPosText.x, HUDBombPos.y + HUDBombPosText.y, "",
            { font: "30px Comic Sans MS", fill: "#f9e000", align: "center" });
    }
};

//Updates HUD depending on game mode
bombHUD.prototype.updateBombHud = function (map, pvpMode) {

    if (!pvpMode) this.updateBombHudPve(map);
    else this.updateBombHudPvp(map);
}

//Updates HUD on PVE mode
bombHUD.prototype.updateBombHudPve = function (map) {

    if (config.endless_rnd_map_gen) {
        this.HUDBombText.text = map.rndGen;

        //if 2 digits recenters the numbers
        if (map.rndGen > 9 && !this.HUDBombTextFF) {
            this.HUDBombTextFF = true;
            this.HUDBombText.position.x += HUDBombPosOffset.x;
        }
    }
}

//Updates HUD for PVP mode
bombHUD.prototype.updateBombHudPvp = function (map) {

    if (map.deathZoneStarted) { //If death zone has already started displays red bomb animation
        if (!this.HUDBombFF) {
            this.HUDBombFF = true;
            this.HUDBombText.visible = false;
            this.HUDBomb.animations.play("red", 4, true);
        }
    }
    else { //If death zone hasn't started displays countdown until it does
        this.HUDBombText.visible = true;
        this.HUDBombFF = false;
        this.HUDBomb.animations.play("static");
    }

    //gets the delay from the timer
    var time = (map.deathZoneTimerEvent.delay - map.deathZoneTimer.ms) / 1000;
    this.HUDBombText.text = Math.round(time);
}

module.exports = bombHUD;

},{"../config.js":6,"../general/point.js":13}],3:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Game Over sprites data
const gmOverSignAnchor = config.gmOverSignAnchor;
const goToMenuAnchor = config.goToMenuAnchor;

const pvpOverPos = config.pvpOverPos;
const pvpOverAnchor = config.pvpOverAnchor;
const pvpOverScale = config.pvpOverScale;
const pvpOverPlayerOffset = config.pvpOverPlayerOffset;
const pvpOverPlayerScale = config.pvpOverPlayerScale;

//Game Over PVP texts Offset
const pvpOverText0Offset = config.pvpOverText0Offset;
const pvpOverText1Offset = config.pvpOverText1Offset;
const pvpOverText2Offset = config.pvpOverText2Offset;
const pvpOverText3Offset = config.pvpOverText3Offset;

//contains all the functions required, each gamemode calls them as needed
var gameOver = {

    //Checks how many deaths happen in PVE
    checkPve: function (game, players) {

        var deathCount = 0;
        for (var i = 0; i < players.length; i++) {
            if (players[i].lives <= 0 && deathCount < players.length)
                deathCount++;
        }

        if (deathCount === players.length) {
            this.menuPve(game);
        }
    },

    //Checks how many wins have the players in PVP
    checkPvp: function (game, players, winsNec) {

        for (var i = 0; i < players.length; i++) {
            if (players[i].wins === winsNec) //end of the match
                this.menuPvp(game, players, i);
        }
    },

    //Go to menu and Game Over sign creation (PVE)
    menuPve: function (game) {

        var gmOverSign = game.add.sprite(winWidth / 2, winHeight / 2, keys.gameOver);
        gmOverSign.anchor.setTo(gmOverSignAnchor.x, gmOverSignAnchor.y);

        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },

    //Go to menu, Game Over sign and ending stats texts creation (PVP)
    menuPvp: function (game, players, numPlayer) {

        //Stops death zone
        players[0].level.deathZoneStop();

        for (var i = 0; i < players.length; i++)
            players[i].dead = true; //no one moves

        //back pannel
        var pvpOver = game.add.sprite(pvpOverPos.x, pvpOverPos.y, keys.gameOverPvpBg);
        pvpOver.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        pvpOver.scale.setTo(pvpOverScale.x, pvpOverScale.y);

        //specific winner sprite
        var playerino = game.add.sprite(pvpOverPos.x + pvpOverPlayerOffset.x, pvpOverPos.y + pvpOverPlayerOffset.y,
            keys.player + numPlayer + 'Clock');
        playerino.anchor.setTo(pvpOverAnchor.x, pvpOverAnchor.y);
        playerino.scale.setTo(pvpOverPlayerScale.x, pvpOverPlayerScale.y);

        //all the texts (player winner, kills, selfkills, pts...)
        var winner = game.add.text(pvpOverPos.x + pvpOverText0Offset.x, pvpOverPos.y + pvpOverText0Offset.y,
            "The player " + (numPlayer+1) + " wins!", { font: "40px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText1Offset.x, pvpOverPos.y + pvpOverText1Offset.y,
            "Kills: " + players[numPlayer].kills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText2Offset.x, pvpOverPos.y + pvpOverText2Offset.y,
            "Selfkills: " + players[numPlayer].selfKills, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        var winner = game.add.text(pvpOverPos.x + pvpOverText3Offset.x, pvpOverPos.y + pvpOverText3Offset.y,
            "Pts: " + players[numPlayer].points, { font: "35px Comic Sans MS", fill: "#f9e000", align: "right" });

        //also draws the go to menu button
        var goToMenu = game.add.button(winWidth, winHeight,
            keys.quitToMenu, function () { game.state.start(keys.mainMenu); }, game);
        goToMenu.anchor.setTo(goToMenuAnchor.x, goToMenuAnchor.y);
    },
}

module.exports = gameOver;

},{"../config.js":6}],4:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Pause Menu objects' data
const pausePanelPos = config.pausePanelPos;
const pausePanelAnchor = config.pausePanelAnchor;
const pausePanelAlpha = config.pausePanelAlpha;
const pausePanelKey = config.keys.pausePanel;

const unpauseButtonPos = config.unpauseButtonPos;
const unpauseButtonAnchor = config.unpauseButtonAnchor;
const unpauseButtonScale = config.unpauseButtonScale;
const unpauseButtonKey = config.keys.resume;

const gotoMenuButtonPos = config.gotoMenuButtonPos;
const gotoMenuButtonAnchor = config.gotoMenuButtonAnchor;
const gotoMenuButtonScale = config.gotoMenuButtonScale;
const gotoMenuButtonKey = config.keys.quitToMenu;

var pausePanel;
var unpauseButton;
var gotoMenuButton;

//not a contructor, contains functions to create the pauseMenu and it objects
var pauseMenu = {

  //Works as a Pause method (a one tick method). Works when clicking out the window too
  //Creates the needed objects for the pause menu and pauses music.
  pausedCreate: function (music, game) {

    music.pause();

    //Disables changes on Game when leaving the game window
    game.stage.disableVisibilityChange = true;

    game.input.onDown.add(unPause, this);

    //Create buttons and sprites
    pausePanel = game.add.sprite(pausePanelPos.x, pausePanelPos.y, pausePanelKey);
    pausePanel.anchor.setTo(pausePanelAnchor.x, pausePanelAnchor.y);
    pausePanel.alpha = pausePanelAlpha;

    unpauseButton = game.add.sprite(pausePanelPos.x + unpauseButtonPos.x, pausePanelPos.y + unpauseButtonPos.y, unpauseButtonKey);
    unpauseButton.anchor.setTo(unpauseButtonAnchor.x, unpauseButtonAnchor.y);
    unpauseButton.scale.setTo(unpauseButtonScale.x, unpauseButtonScale.y);

    gotoMenuButton = game.add.sprite(pausePanelPos.x + gotoMenuButtonPos.x, pausePanelPos.y + gotoMenuButtonPos.y, gotoMenuButtonKey);
    gotoMenuButton.anchor.setTo(gotoMenuButtonAnchor.x, gotoMenuButtonAnchor.y);
    gotoMenuButton.scale.setTo(gotoMenuButtonScale.x, gotoMenuButtonScale.y);

    //Unpausing by resuming the game or going back to the Main Menu
    function unPause() {
      if (game.paused) {
        if (checkBorders(game.input, unpauseButton)) game.paused = false;

        else if (checkBorders(game.input, gotoMenuButton)) {
          game.state.start('mainMenu');
          game.paused = false;
        }
      }
    };

    //Checks input on sprites (own-made buttons because of game pause problems)
    function checkBorders(inputPointer, button) {
      return (inputPointer.position.x > button.position.x - button.texture.width / 2
        && inputPointer.position.x < button.position.x + button.texture.width / 2
        && inputPointer.position.y > button.position.y - button.texture.height / 2
        && inputPointer.position.y < button.position.y + button.texture.height / 2)
    }
  },

  //Destroying pause menu things. Returning needed variables/objects to previous values
  resumedMenu: function (music, gInputs, game) {
    music.resume();
    game.stage.disableVisibilityChange = false;
    gInputs.pMenu.ff = false;

    pausePanel.destroy();
    unpauseButton.destroy();
    gotoMenuButton.destroy();
  },

  //Stops the ability to use the menu
  offPauseMenuControl: function (game, gInputs) {
    if (gInputs.pMenu.button.isDown && !gInputs.pMenu.ff) {
      gInputs.pMenu.ff = true;
      game.paused = true;
    }
    else if (gInputs.pMenu.isUp)
      gInputs.pMenu.ff = false;
  }
}

module.exports = pauseMenu;

},{"../config.js":6}],5:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const Point = require('../general/point.js');

const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Player info HUD objects' data (sprites)
const HUDbombHeadPos = config.HUDbombHeadPos;
const HUDbombHeadScale = config.HUDbombHeadScale;

const HUD2Pos = config.HUD2Pos;
const HUD2Scale = config.HUD2Scale;

const HUDlivesPos = config.HUDlivesPos;
const HUDlivesScale = config.HUDlivesScale;

const HUDPointsNumberPos = config.HUDPointsNumberPos;
const HUDPointsNumberScale = config.HUDPointsNumberScale;

const HUDPressXPos = config.HUDPressXPos;
const HUDPressXScale = config.HUDPressXScale;

var HUDPressX; //extra object (logic stored here)

//Contructor. Creates all sprites and texts
//each mode needs to call the updatePlayerInfoHud
var playerInfoHUD = function (game, HUDbombHead, playerNum, pvpMode) {

    var posX; //depends on pvpMode
    if (!pvpMode) posX = HUDbombHeadPos.x + ((winWidth / 2) * playerNum);
    else posX = HUDbombHeadPos.x + ((winWidth / 5) * playerNum);

    //little player sprite to use as clock when required
    HUDbombHead[playerNum] = game.add.sprite(posX, HUDbombHeadPos.y, keys.player + playerNum + 'Clock');
    HUDbombHead[playerNum].scale.setTo(HUDbombHeadScale.x, HUDbombHeadScale.y);

    //two points + text for lives
    this.HUD2 = game.add.sprite(posX + HUD2Pos.x, HUD2Pos.y, keys.HUD2);
    this.HUD2.scale.setTo(HUD2Scale.x, HUD2Scale.y);

    this.HUDlives = game.add.text(this.HUD2.position.x + HUDlivesPos.x, HUDlivesPos.y, "",
        { font: "45px Comic Sans MS", fill: "#f9e000", align: "center" });
    this.HUDlives.anchor.setTo(HUDlivesScale.x, HUDlivesScale.y);

    //draw points on pve
    if (!pvpMode) {

        this.HUDPointsNumber = game.add.text(posX + HUDPointsNumberPos.x, HUDPointsNumberPos.y, "",
            { font: "50px Comic Sans MS", fill: "#f9e000", align: "right" });
        this.HUDPointsNumber.anchor.setTo(HUDPointsNumberScale.x, HUDPointsNumberScale.y);

        if (playerNum === 1 && HUDPressX !== undefined) HUDPressX.destroy();
    }

    //if only 1 player then draw the "press X"
    else if (playerNum === 2 && HUDPressX !== undefined) {
        HUDPressX.destroy();
    }

}

//Updates player info
playerInfoHUD.prototype.updatePlayerInfoHud = function (player, pvpMode) {

    if (pvpMode) this.HUDlives.text = player.wins;
    else {
        this.HUDlives.text = player.lives;
        this.HUDPointsNumber.text = player.points;
    }
}

//Draws the 'Press X' sign when needed
playerInfoHUD.drawPressX = function (game, pvpMode) {
    var posX = winWidth / 2 + HUDPressXPos.x;
    if (pvpMode) posX -=  100; //position depends on the mode

    HUDPressX = game.add.sprite(posX, HUDPressXPos.y, keys.HUDPressX);

    HUDPressX.scale.setTo(HUDPressXScale.x, HUDPressXScale.y);
    HUDPressX.visible = true;
}


module.exports = playerInfoHUD;

},{"../config.js":6,"../general/point.js":13}],6:[function(require,module,exports){
'use strict';

const keys = require('./keys.js');
const Point = require('./general/point.js');

const width = 800;
const height = 600;

const config = {

    keys: keys,

    HACKS: false, //extra controls (rebuild level, next level, show bodys)

    endless_rnd_map_gen: true,

    default_muted: false,
    default_volume: 0.25,

    DEBUG: false,
    debugPos: new Point(32, height - 96),
    debugColor: "yellow",

    winWidth: width,
    winHeight: height,

    tileData: {
        Res: new Point(64, 64),
        Scale: new Point(0.75, 0.625), //64x64 to 48x40
        Offset: new Point(40, 80), //space for hud
    },


    //PvE
    initialMapPveDEBUG: { world: 0, level: 0 },
    initialMapPve: { world: 1, level: 1 },
    pve_initialPlayers: 1,
    pve_maxPlayers: 2, //needed for the map generation

    playerLifeTime: 2.5 * 60 * 1000,
    hudAnimSpeed: 10 / (2.5 * 60), //animation lasts 3 min

    //PvP
    initialMapPvP: { world: 1, level: 0 },
    pvp_initialPlayers: 2,
    pvp_maxPlayers: 4,

    deathZoneTimeStart: 1.5 * 60 * 1000, //sync with hud anim
    deathZoneTimeLoop: 2.5 * 1000,
    hudAnimSpeedPvp: 10 / (2 * 60), //animation lasts 2 min

    //MAP

    debugMapPos: new Point(40, 504),
    defaultBodyOffset: new Point(),
    defaultImmovable: true,
    defaultBombableLives: 1,
    defaultBombableInvencibleTime: 0,


    //PLAYER

    //doesnt affect to the controls, it's used for the debug ingame
    stringsControls: ["WASD + E","ARROWS + Numpad_1","TFGH + Y","IJKL + O"],

    playerBodySize: new Point(40, 32), //little smaller
    playerBodyOffset: new Point(6, 48),
    playerExtraOffset: new Point(6, -20), //reaquired because player body is not full res

    playerImmovable: false,

    playerLives: 3,
    playerExtraLifePoints: 3000,
    playerNumBombs: 1,

    playerInvencibleTime: 5000,
    playerRespawnedStoppedTime: 1000,
    playerDeathTime: 1500,

    playerVelocity: 140, //max=playerVelocity+5*10 (depends on powerUps)
    playerVelocityTurning: 105, //140 105


    //BOMBABLE

    bombableTimer: 500,
    step: Math.PI * 2 / 360, //degrees
    playerInitialAlphaAngle: 30, //sin(playerInitialAlphaAnlge) -> alpha
    alphaWavingSpeed: 1.75,


    //IDENTIFIABLE

    idBodySize: new Point(32, 32),
    idBodyOffset: new Point(0, 0),
    idExtraOffset: new Point(14, 10),
    idImmovable: true,


    //POWEUPS

    bombsKey: "numBombs",
    bombsAdd: 1,
    bombsMin: 1,
    bombsMax: 10,

    flameKey: "power",
    flameAdd: 1,
    flameMax: 10, //no flame min needed

    speedKey: "velocity",
    speedAdd: 25,
    speedMin: 200,
    speedLimit: 200 + 25 * 8,


    //BOMB

    bombBodySize: new Point(48, 48), //little smaller
    bombBodyOffset: new Point(0, 0),
    bombExtraOffset: new Point(5, 5), //reaquired because bomb body is not full res

    bombImmovable: true,
    bombInvecibleTime: 0,

    bombLives: 1,
    bombPower: 1,
    bombTimer: 2000,
    bombFlameTimer: 500,


    //FLAMES

    flameBodySize: new Point(48, 48),
    flameBodyOffset: new Point(0, 0),
    flameExtraOffset: new Point(5, 5),
    flameImmovable: true,


    //ENEMY

    enemyBasicVelocity: 90,
    enemyExtraOffset: new Point(0, 0),
    enemyImmovable: false,
    enemyInvecibleTime: 2500, //maybe reduce


    //PORTAL

    defaultEnemyType: 0,
    portalImmovable: true,
    portalInvencible: true,
    portalDropId: undefined,
    portalSpinVel: 0.05,
    portalBombTimer: 500,
    portalSpawnTimer: 1500,
    portalAnchor: new Point(0.5, 0.5),


    //PLAYERINFO HUD

    HUDbombHeadPos: new Point(60, 10),
    HUDbombHeadScale: new Point(0.75, 0.70),
    HUDPressXPos: new Point(90, -10),
    HUDPressXScale: new Point(0.75, 0.75),

    HUD2Pos: new Point(35, -5),
    HUD2Scale: new Point(0.75, 0.75),
    HUDlivesPos: new Point(42, 15),
    HUDlivesScale: new Point(0.2, 0),

    HUDPointsNumberPos: new Point(170, 8),
    HUDPointsNumberScale: new Point(0.2, 0),

    HUDBombPos: new Point(0, 17),
    HUDBombAnchor: new Point(0.5, 0),
    HUDBombScale: new Point(1.2, 1.2),

    HUDFlameOffset: new Point(0, -16),
    HUDFlameScale: new Point(1.5, 1.5),

    HUDBombPosText: new Point(-8, 8),
    HUDBombPosOffset: new Point(-5,0),

    //GAME OVER

    gmOverSignAnchor: new Point(0.5, 0.5),
    goToMenuAnchor: new Point(1, 1),

    pvpOverPos: new Point(width/2, height/2+40),
    pvpOverAnchor: new Point(0.5, 0.5),
    pvpOverScale: new Point(1, 1),
    pvpOverPlayerOffset: new Point(-115, 20),
    pvpOverPlayerScale: new Point(1.7, 1.7),

    pvpOverText0Offset: new Point(-180, -140),
    pvpOverText1Offset: new Point(-20, -70),
    pvpOverText2Offset: new Point(-20, -10),
    pvpOverText3Offset: new Point(-20, 50),

    //AUDIO HUD

    volume_increment: 0.10,
    volume_Max: 1,
    volume_Min: 0.10,

    muteMusicButtonPos: new Point(10, 40),
    muteMusicButtonScale: new Point(0.1, 0.1),
    mutedMusicButtonPos: new Point(10, 40),
    mutedMusicButtonScale: new Point(0.1, 0.1),
    lessVolButtonPos: new Point(10, 10),
    lessVolButtonScale: new Point(0.04, 0.04),
    moreVolButtonPos: new Point(30, 10),
    moreVolButtonAnchor: new Point(1, 1),
    moreVolButtonScale: new Point(0.04, 0.04),
    moreVolButtonAngle: 180,


    //PAUSE MENU

    pausePanelPos: new Point(width/2, height/2+40),
    pausePanelAnchor: new Point(0.5, 0.5),
    pausePanelAlpha: 0.5,
    unpauseButtonPos: new Point(0, -50),
    unpauseButtonAnchor: new Point(0.5, 0.5),
    unpauseButtonScale: new Point(0.75, 0.75),
    gotoMenuButtonPos: new Point(0, 50),
    gotoMenuButtonAnchor: new Point(0.5, 0.5),
    gotoMenuButtonScale: new Point(0.75, 0.75),


    //MAIN MENU

    buttonCount: 1,
    initWinsNecessary: 1,
    minWinsNec: 1,
    maxWinsNec: 9,
    mMenuBGPos: new Point(0, 0),
    mMenuBGScale: new Point(1, 1.05),
    mMenuPVEPos: new Point(0, 90),
    mMenuPVEScale: new Point(0.7, 0.7),
    mMenuPVEAnchor: new Point(0.5, 0.5),
    mMenuPVPPos: new Point(0, 160),
    mMenuPVPScale: new Point(0.7, 0.7),
    mMenuPVPAnchor: new Point(0.5, 0.5),
    mMenuTitlePos: new Point(50, -175),
    numbers: { pos: new Point(260, 0), scale: new Point(0.5, 0.5), anchor: new Point(0.4, 0.4) },
    doneButton: { pos: new Point(0, 50), scale: new Point(0.5, 0.5), anchor: new Point(0.5, 0.5) },
    howManyWins: { pos: new Point(0, -50), scale: new Point(0.3, 0.3), anchor: new Point(0.5, 0.5) },


    //INPUTS

    debugPos: new Point(40, 504),
    debugPosSeparation: 15,
};

module.exports = config;

},{"./general/point.js":13,"./keys.js":17}],7:[function(require,module,exports){
'use strict';
const config = require('../config.js'); //configuration data

const Bombable = require('../objects/bombable.js'); //father
const Point = require('../general/point.js');
const Identifiable = require('../id/identifiable.js'); //deploy power ups

//default enemy values
const enemySpritePath = config.keys.enemy;
const enemyExtraOffset = config.enemyExtraOffset;

const enemyImmovable = config.enemyImmovable;
const enemyInvecibleTime = config.enemyInvecibleTime; //maybe reduce
const bombFlameTimer = config.bombFlameTimer; //to sync with flames
const tmpInvenTime = config.tmpInvenTime; //to sync with flames

//all the data (points, speed, sprite, bodysize)
var enemyDataBase = require('./enemyDataBase.js');

//Enemy constructor. Inherits from Bombable.
//The players detects overlap with these, and dies.
function Enemy(game, position, level, enemyType, tileData, groups, dropId) {

    this.tileData = tileData;
    this.groups = groups;
    this.level = level;

    this.enemyType = enemyType; //not really used atm
    this.pts = enemyDataBase[enemyType].pts;

    var enemyBodySize = enemyDataBase[enemyType].bodySize;
    var enemyBodyOffset = enemyDataBase[enemyType].bodyOffset;

    var enemySprite = enemySpritePath + "_" + enemyType; //constructed
    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, level, groups, enemyPosition, enemySprite,
        tileData.Scale, enemyBodySize, enemyBodyOffset, enemyImmovable,
        enemyDataBase[enemyType].lives, enemyInvecibleTime, dropId);

    //Enemy animations
    this.animations.add("walking_left", [19, 20, 21, 22, 23, 24, 25], 10, true);
    this.animations.add("walking_right", [12, 13, 14, 15, 16, 17, 18], 10, true);
    this.animations.add("walking_up", [0, 1, 2, 3, 4, 5], 10, true);
    this.animations.add("walking_down", [6, 7, 8, 9, 10, 11], 10, true);

    level.updateSquare(position, level.types.free.value); //clears the map square

    //starting the movement
    this.dir = new Point();
    this.velocity = enemyDataBase[enemyType].velocity;
    this.pickDirection();
    this.setSpeed(this.dir);
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {

    this.checkFlames(); //bombable method

    if (this.dead) { //not moving
        this.body.immovable = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    else {
        //if hitted (and not dead) its alpha waves
        if (this.tmpInven) this.invencibleAlpha();

        this.logicMovement(); //basic IA

        //animation
        if (this.body.velocity.x > 0) {
            // this.scale.setTo(this.tileData.Scale.x, this.tileData.Scale.y);
            this.animations.play("walking_right");
        }
        else if (this.body.velocity.x < 0) {
            // this.scale.setTo(this.tileData.Scale.x*-1, this.tileData.Scale.y);
            this.animations.play("walking_left");
        }
        else if (this.body.velocity.y > 0)
            this.animations.play("walking_down");
        else if (this.body.velocity.y < 0)
            this.animations.play("walking_up");
        else {
            //pick direction if trapped to be able to scape afterwards
            this.pickDirection();
            if (this.dir.x !== 0 || this.dir.y !== 0) this.setSpeed(this.dir);
            this.animations.stop();
        }
    }
}


//player, bomb, enemie, etc extend this (from bombable)
Enemy.prototype.die = function (flame) {
    // console.log("checkin enemie die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        this.alpha /= 2; //half alpha when killed

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombFlameTimer - 5, drop, this);

        //gives points to the player
        if (flame.player !== undefined) flame.player.addPoints(this.pts);

        //then destroys itself
        this.game.time.events.add(bombFlameTimer + 5, this.destroy, this);
    }
    //if not killed then becomes vencible again
    else this.game.time.events.add(enemyInvecibleTime, flipInven, this);

    function flipInven() { this.tmpInven = false; this.alpha = 1; }
    function drop() {
        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
}


//all the IA is just movement
Enemy.prototype.logicMovement = function () {

    //virtual map pos and extra pos to cehck collisions
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);
    var extraPosMap = new Point(this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, enemyExtraOffset);

    //first we check if the path is blocked
    if (this.checkCollision(positionMap, extraPosMap)) {

        this.body.velocity.x = 0; //stops the enemy
        this.body.velocity.y = 0;

        this.pickDirection(); //change direction

        //moves the enemy (if it is not totally blocked) **may change this
        if (this.dir.x !== 0 || this.dir.y !== 0)
            this.setSpeed(this.dir);
    }
    //and then we check if some enemy is on the path
    else if (this.checkEnemyOverlap(positionMap)) {
        this.body.velocity.x *= -1; //inverts its velocity
        this.body.velocity.y *= -1;
        this.dir.multiply(-1, -1); //and dir accordingly too
    }
}

//Picks a new rnd direction (free)
Enemy.prototype.pickDirection = function () {

    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);

    //array with all free dirs
    var freeSurroungings = this.level.getSurroundingFreeSquares(positionMap);

    var rnd = this.game.rnd.integerInRange(0, freeSurroungings.length - 1);

    // console.log(positionMap, freeSurroungings, rnd);

    //picks a dir using rnd
    if (freeSurroungings.length === 0) this.dir = new Point();
    else this.dir = freeSurroungings[rnd];
}

//Simple method to set speed
Enemy.prototype.setSpeed = function (dir) {
    if (this.dir.x === 1) this.body.velocity.x = this.velocity;
    else if (this.dir.x === -1) this.body.velocity.x = -this.velocity;
    else if (this.dir.y === 1) this.body.velocity.y = this.velocity;
    else if (this.dir.y === -1) this.body.velocity.y = -this.velocity;
}

//checks if the enemy is getting closer to a block
Enemy.prototype.checkCollision = function (positionMap, extraPosMap) {
    var blocked = false;

    //checks if the next square is free and if the enemy is in the center
    if ((!this.level.isNextSquareFree(positionMap, this.dir))
        && extraPosMap.isNull()) {
        // console.log("Enemy turning");
        blocked = true;
    }

    return blocked;
}

//checks for enemies blocking the path
Enemy.prototype.checkEnemyOverlap = function (positionMap) {

    var enemyBlocking = false;
    this.game.physics.arcade.overlap(this, this.groups.enemy, checkPositions);

    return enemyBlocking; //the callback affects the bool...

    //only matters if the other enemy is blocking the path
    //(we do nothing if thisEnemy is the one blocking otherEnemy)
    function checkPositions(thisEnemy, otherEnemy) {

        if (thisEnemy !== otherEnemy) { //not overlap with itself
            //console.log("Enemy overlapping");

            var otherEnemyPos = new Point(otherEnemy.position.x, otherEnemy.position.y)
                .getMapSquarePos(otherEnemy.tileData, enemyExtraOffset);

            //first calculates the next position
            var nextPos = new Point(positionMap.x, positionMap.y)
                .add(thisEnemy.dir.x, thisEnemy.dir.y)

            //gets the array to check
            var positionsToCheck = getPositionsToCheck(nextPos, thisEnemy);
            // console.log(positionsToCheck);

            //if any of the pos are occupied then thepath is blocked
            for (var i = 0; i < positionsToCheck.length; i++) {

                if (positionsToCheck[i].isEqual(otherEnemyPos))
                    enemyBlocking = true;
            }
        }
    }

    //returns an array with the next dir and the diagonals
    function getPositionsToCheck(nextPos, thisEnemy) {

        var positions = [positionMap, nextPos]; //array container

        //then both diagonals
        positions.push(getDiagonal(1));
        positions.push(getDiagonal(-1));

        return positions;

        //calculates the diagonal by adding and then fixing
        function getDiagonal(parameter) {

            var diagonalDir = new Point(thisEnemy.dir.x, thisEnemy.dir.y)
                .add(parameter, parameter);

            if (diagonalDir.x % 2 === 0) diagonalDir.x = 0;
            if (diagonalDir.y % 2 === 0) diagonalDir.y = 0;

            return new Point(nextPos.x, nextPos.y)
                .add(diagonalDir.x, diagonalDir.y);
        }
    }

}

module.exports = Enemy;

},{"../config.js":6,"../general/point.js":13,"../id/identifiable.js":15,"../objects/bombable.js":24,"./enemyDataBase.js":8}],8:[function(require,module,exports){
'use strict';
const config = require('../config.js'); //configuration data

const Point = require('../general/point.js');

const basicVelocity = config.enemyBasicVelocity;

var enemyDataBase = [

    {   //Enemy 1 data
        lives: 1,
        velocity: basicVelocity,
        pts: 100,
        bodySize: new Point(48, 48),
        bodyOffset: new Point(8, 8),
    },
    {   //Enemy 2 data
        lives: 2,
        velocity: basicVelocity,
        pts: 250,
        bodySize: new Point(50, 50),
        bodyOffset: new Point(6, 6),
    },
    {   //Enemy 3 data
        lives: 1,
        velocity: basicVelocity*1.1,
        pts: 150,
        bodySize: new Point(42, 42),
        bodyOffset: new Point(10, 10),
    },
];

module.exports = enemyDataBase;

},{"../config.js":6,"../general/point.js":13}],9:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Physical = require('../objects/physical.js');
const Point = require('../general/point.js');

//default flame values
const flameBodySize = config.flameBodySize; //little smaller
const flameBodyOffset = config.flameBodyOffset;
const flameExtraOffset = config.flameExtraOffset; //flame body is not full res
const flameImmovable = config.flameImmovable;
const flameSprite = config.keys.flame;

//Flame constructor. Inherits from Physical
//Bombables detect overlap with these and die
function Flame (game, position, scale, player) {

    this.player = player; //link to reward the kill/points

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);

    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);

    //animation
    this.animations.add("flaming", [0, 1, 2, 3, 4], 15, true);
    this.animations.play("flaming");
}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;

},{"../config.js":6,"../general/point.js":13,"../objects/physical.js":26}],10:[function(require,module,exports){
'use strict';

//different function used in the gamemodes
var globalControls = {

    //allow to add extra players
    addPlayerControl: function (gInputs, players, maxPlayers, playerInfoHUDs) {
        if (gInputs.addPlayer.button.isDown && !gInputs.addPlayer.ff && players.length < maxPlayers) {
            gInputs.addPlayer.ff = true;

            //adapt lives of the rest of the players
            for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
                //divides by 2 all players' lives (integers) but only down to 1
                if (players[numPlayer].lives > 1) {
                    players[numPlayer].lives -= players[numPlayer].lives % 2;
                    players[numPlayer].lives /= 2;
                }
            }

            var pSample = players[0]; //to use its values
            var hudSample = playerInfoHUDs[0];

            //first the hud
            playerInfoHUDs.push(new hudSample.constructor(pSample.game, pSample.hudVidas, players.length, pSample.level.pvpMode))

            //then the player, both using the contructor from samples
            players.push(new pSample.constructor(pSample.game, pSample.level,
                players.length, pSample.tileData, pSample.groups, pSample.hudVidas))

            //adapt the new player's lives
            players[players.length - 1].lives = pSample.lives;
        }

        else if (gInputs.addPlayer.button.isUp)
            gInputs.addPlayer.ff = false;
    },

    //shows hitboxes and make players invulnerable
    debugModeControl: function (gInputs, game, players) {
        if (gInputs.debug.button.isDown && !gInputs.debug.ff) {

            gInputs.debug.state = !gInputs.debug.state; //toggle state
            gInputs.debug.ff = true;

            //activate invencivility
            players.callAll("endlessInvencibility");

            if (!gInputs.debug.state) {
                players.callAll("endInvencibility");
                game.debug.reset(); //reset whole debug render
            }
        }

        else if (gInputs.debug.button.isUp)
            gInputs.debug.ff = false;

    },

    //resets the actual level
    resetLevelControl: function (gInputs, level) {
        if (gInputs.resetLevel.button.isDown && !gInputs.resetLevel.ff) {
            gInputs.resetLevel.ff = true;

            level.regenerateMap(); //just a map method
        }

        else if (gInputs.resetLevel.button.isUp)
            gInputs.resetLevel.ff = false;
    },

    //loads next level
    nextLevelControl: function (gInputs, level) {
        if (gInputs.nextLevel.button.isDown && !gInputs.nextLevel.ff) {
            gInputs.nextLevel.ff = true;

            level.generateNextMap(); //same as regenerate
        }

        else if (gInputs.nextLevel.button.isUp)
            gInputs.nextLevel.ff = false;
    },
}

module.exports = globalControls;

},{}],11:[function(require,module,exports){
'use strict';

//Creates all the games's group
function Groups(game) {

    this.background = game.add.group();
    this.wall = game.add.group();
    this.box = game.add.group();

    this.portal = game.add.group();
    this.bomb = game.add.group();
    this.flame = game.add.group();

    this.powerUp = game.add.group();
    this.player = game.add.group();
    this.enemy = game.add.group();
}

//clears all but players (destroy + creates) used by the map
Groups.prototype.clearGroups = function (game) {

    var keys = Object.keys(this); //gets all the groups keys

        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== "player") { //avoids player
                this[keys[i]].destroy(true);
                this[keys[i]] = game.add.group();
            }
        }
}

//draws all elements bodies
Groups.prototype.drawDebug = function (game) {

    var keys = Object.keys(this); //gets all the groups keys

    for (let i = 0; i < keys.length; i++) { //draws them

        for (let j = 0; j < this[keys[i]].length; j++)
            game.debug.body(this[keys[i]].children[j]);
    }
}

module.exports = Groups;

},{}],12:[function(require,module,exports){
'use strict';
const config = require('../config.js');

//returns the inputs for player 0-3 and global actions
//sort of data storage/factory (it needs game's reference)

const debugPos = config.debugPos;
const debugPosSeparation = config.debugPosSeparation;
const debugColor = config.debugColor;

const stringsControls = config.stringsControls;

var debugCallback;

function Inputs(game, numPlayer) {

    if (numPlayer === -1) this.globalControls(game); //-1 coded for global
    else {
        //needed to be created first
        this.bomb = {ff: false}; //bomb flip flop (not really a control)

        this.switchControls(game, numPlayer);
    }
};

//all global inputs
Inputs.prototype.globalControls = function(game) {
    this.pMenu = { //Pausing control
        button: game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        ff: false
    }
    this.addPlayer = { //Adding player control
        button: game.input.keyboard.addKey(Phaser.Keyboard.X),
        ff: false
    }
    this.debug = { //Debug display control
        button: game.input.keyboard.addKey(Phaser.Keyboard.C),
        ff: false,
        state: false
    }
    this.resetLevel = { //Reset level control
        button: game.input.keyboard.addKey(Phaser.Keyboard.B),
        ff: false,
    },
    this.nextLevel = { //Next level control
        button: game.input.keyboard.addKey(Phaser.Keyboard.N),
        ff: false,
    }
}

//selects specific controls for each player
Inputs.prototype.switchControls = function (game, numPlayer) {
    switch (numPlayer) {
        case 0: //Player 0: WASD+E
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.E)

            this.drawDebug(game, numPlayer);
            break;

        case 1: //Player 1: Arrows+Numpad_1
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)

            this.drawDebug(game, numPlayer);
            break;

        case 2: //Player 2: TFGH+Y
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.T),
                down: game.input.keyboard.addKey(Phaser.Keyboard.G),
                left: game.input.keyboard.addKey(Phaser.Keyboard.F),
                right: game.input.keyboard.addKey(Phaser.Keyboard.H),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.Y)

            this.drawDebug(game, numPlayer);
            break;

        case 3: //Player 3: IJKL+O
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.O)

            this.drawDebug(game, numPlayer);
            break;
    }
}

//writes the controls for a specific player ingame
Inputs.prototype.drawDebug = function(game, numPlayer) {

    if (debugCallback !== undefined) game.time.events.remove(debugCallback);

    game.debug.text(" - Controls P" +numPlayer+ ": " +stringsControls[numPlayer],
        debugPos.x, debugPos.y + debugPosSeparation * numPlayer, debugColor);

    //resets it afterwards
    debugCallback = game.time.events.add(5000, function reset () {this.debug.reset();}, game);
}

module.exports = Inputs;

},{"../config.js":6}],13:[function(require,module,exports){
'use strict';

//Used at aligment calculation, makes the center wide (instead of puntual)
const centerMarginPercentage = 0.001; //Will be multiplied for the square size

//Extends Phaser.Point
function Point(x, y) {

    Phaser.Point.call(this, x, y);
}
Point.prototype = Object.create(Phaser.Point.prototype);
Point.prototype.constructor = Point;


//calculates real position of a map point based on tileData
//accepts an offset, but can be used with only 1 parameter
Point.prototype.applyTileData = function (tileData, extraOffset) {

    this.multiply(tileData.Res.x, tileData.Res.y)
        .multiply(tileData.Scale.x, tileData.Scale.y)
        .add(tileData.Offset.x, tileData.Offset.y);

    if (extraOffset !== undefined)
        return this.add(extraOffset.x, extraOffset.y);
    else return this;
}
//gets the calculated real position of a map point based on tileData
Point.prototype.getAppliedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y)
        .multiply(tileData.Res.x, tileData.Res.y)
        .multiply(tileData.Scale.x, tileData.Scale.y)
        .add(tileData.Offset.x, tileData.Offset.y);

    if (extraOffset !== undefined)
        return tmp.add(extraOffset.x, extraOffset.y);
    else return tmp;
}

//calculates map position of a real point based on tileData
//** not the exact square **
Point.prototype.reverseTileData = function (tileData, extraOffset) {

    if (extraOffset !== undefined)
        this.subtract(extraOffset.x, extraOffset.y);

    this.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x, tileData.Scale.y)
        .divide(tileData.Res.x, tileData.Res.y);

    return this;
}
//gets the calculated map position of a real point based on tileData
Point.prototype.getReversedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y);

    if (extraOffset !== undefined)
        tmp.subtract(extraOffset.x, extraOffset.y);

    tmp.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x, tileData.Scale.y)
        .divide(tileData.Res.x, tileData.Res.y);

    return tmp;
}


//gets rounded map square value
Point.prototype.getMapSquarePos = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);

    //calculates the module and subtracts them
    var difX = exactMapValue.x % 1;
    exactMapValue.x -= difX;
    if (difX >= 0.5) exactMapValue.x++; //then adapts to the closest

    var difY = exactMapValue.y % 1;
    exactMapValue.y -= difY;
    if (difY >= 0.5) exactMapValue.y++;

    return exactMapValue;
}

//gets the relative normalized dir of the extra square the player is touching
//compares the real position and the calculated by getMapSquarePos
//there is some margin to detect being centered (centerMarginPercentage)
Point.prototype.getMapSquareExtraPos = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);
    var virtualMapValue = this.getMapSquarePos(tileData, extraOffset);
    var extraDir = new Point();

    //margin to consider the center wide (not just a point)
    var margin = (tileData.Res.x * tileData.Scale.x + tileData.Res.y * tileData.Scale.y) / 2;
    margin *= centerMarginPercentage;
    //console.log(margin);

    var difX = exactMapValue.x - virtualMapValue.x;
    if (difX < 0 - margin) extraDir.x = -1;
    else if (difX > 0 + margin) extraDir.x = 1;
    //console.log(difX);

    var difY = exactMapValue.y - virtualMapValue.y;
    if (difY < 0 - margin) extraDir.y = -1;
    else if (difY > 0 + margin) extraDir.y = 1;

    //console.log(extraDir);
    return extraDir;
}


//returns true if the directions are parallel (only normalized dirs)
Point.prototype.isParallel = function (dir) {
    return (this.isEqual(dir)) || (this.isEqual(dir.inversed()));
}

//return true if the points are equal
Point.prototype.isEqual = function (otherPoint) {
    return (this.x === otherPoint.x && this.y === otherPoint.y)
}

//returns the inverse of the point
Point.prototype.inversed = function (otherPoint) {
    return new Point(-this.x, -this.y);
}

//returns true if the point is null
Point.prototype.isNull = function () {
    return this.isEqual(new Point());
}

module.exports = Point;

},{}],14:[function(require,module,exports){
'use strict';
var config = require('../config.js');

var modsFunctions = require('./modsFunctions.js'); //all the database
//*A previous version with types of mods (instead of all functions)
//*is in "unused" folder, but the fixed applyMods was removed directly

//contains the different tiers, and inside the power ups
var idDataBase = [

    [ //tier 0 reserved for the portal to next level
        //not power up but the id (0,0) is reserved for the map generation
        /*{   //0
            sprite: 'portal', pts: 0,
            mods: [modsFunctions.levelUp]
        },*/
    ],

    [ //tier 1
        {   //0
            sprite: config.keys.powerUpBombUp, pts: 200,
            mods: [modsFunctions.bombUp] //all use functions
        },
        {   //1
            sprite: config.keys.powerUpFlameUp, pts: 300,
            mods: [modsFunctions.flameUp]
        },
        {   //2
            sprite: config.keys.powerUpSpeedUp, pts: 100,
            mods: [modsFunctions.speedUp]
        }
    ],

    [ //tier 2 //only points items
        {   //0
            sprite: config.keys.pointsUp, pts: 50,
            mods: [] //does nothing
        },
        {   //1
            sprite: config.keys.pointsUpPlus, pts: 500,
            mods: []
        },
    ]
];

module.exports = idDataBase;

},{"../config.js":6,"./modsFunctions.js":16}],15:[function(require,module,exports){
'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');
const config = require('../config.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
const idBodySize = config.idBodySize; //little smaller
const idBodyOffset = config.idBodyOffset;
const idExtraOffset = config.idExtraOffset; //id body is not full res
const idImmovable = config.idImmovable;

var powerUpSound;

//Identifiable constructor. Inherits from Physical. Dropped by enemies/boxes when destroyer.
//Players can pick them and gets their effects applied/points added
function Identifiable(game, position, scale, id) {

    var idPosition = new Point (position.x, position.y).add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, idPosition, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    //sounds when picked
    powerUpSound = this.game.add.audio('powerup');

    this.id = id; //used for consult
    this.pts = idDataBase[id.tier][id.num].pts;
}

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


//method used by players to pick powerUps (so they do not need idDataBase)
Identifiable.pickPowerUp = function(powerUp, player) {
    var mods = idDataBase[powerUp.id.tier][powerUp.id.num].mods;
    powerUpSound.play();
    Identifiable.applyMods(mods, player);
}


//generic base id factorie
Identifiable.Id = function (tier, num) {this.tier = tier; this.num = num;}
//get tier size (for the map rnd generation)
Identifiable.tierSize = function (tier) {return idDataBase[tier].length;}


//used to add powerUps (requires the ids)
Identifiable.addPowerUps = function(powerUpIds, target, reverseMode) {
  //Adds the id of the mods to the player.mods (so we can reverse them, etc)
  for (var i = 0; i < powerUpIds.length; i++) {
      if (!reverseMode)target.mods.push(powerUpIds[i]);
    // //   //else target.mods.pop(); //ordered. NOT SURE if we should keep them
      //we do not pop, we keep target.mods as a log of powerUps

      var mods = idDataBase[powerUpIds[i].tier][powerUpIds[i].num].mods;
      Identifiable.applyMods(mods, target, reverseMode);
  }
}

//call respectives functions applied to the player
Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      mods[i].call(target, reverseMode);
  }
}

module.exports = Identifiable;

},{"../config.js":6,"../general/point.js":13,"../objects/physical.js":26,"./idDataBase.js":14}],16:[function(require,module,exports){
'use strict';
const config = require('../config.js');

//default values
var bombsKey = config.bombsKey;
var bombsAdd = config.bombsAdd;
var bombsMin = config.bombsMin;
var bombsMax = config.bombsMax;

var flameKey = config.flameKey;
var flameAdd = config.flameAdd;
var flameMax = config.flameMax; //no flame min needed

var speedKey = config.speedKey;
var speedAdd = config.speedAdd;
var speedMin = config.speedMin;
var speedLimit = config.speedLimit;


//contains the different powerUp's functions. Unordered.
var modsFunctions = {

    bombUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, bombsKey, bombsAdd, bombsMin, bombsMax);
    },

    flameUp: function (reverseMode) {
        if (!reverseMode) this.bombMods.push(bombMods.flameUp);
        else this.bombMods.pop(); //follows an order
    },

    speedUp: function (reverseMode) {
        basicStatChange.call(this,
            reverseMode, speedKey, speedAdd, speedMin, speedLimit);
    },
}

//contains the different bomb functions
//as they are short I could put the in the push()
//but this way maybe a single power Up can do more the one of these
var bombMods = {
    flameUp: function () {
        basicAddition.call(this, flameKey, flameAdd, flameMax)
    }
}

//very common power up behavior (add, sub with min max and reverse mode)
function basicStatChange (reverseMode, stat, value, min, max) {
    if (!reverseMode) basicAddition.call(this, stat, value, max)
    else basicSubtraction.call(this, stat, value, min)
}
function basicAddition (stat, add, max) {
    if (this[stat]+add <= max) this[stat]+=add;
    else this[stat] = max;
}
function basicSubtraction (stat, sub, min) {
    if (this[stat]-sub >= min) this[stat]-=sub;
    else this[stat] = min;
}

module.exports = modsFunctions;

},{"../config.js":6}],17:[function(require,module,exports){
'use strict';

const keys = {


//STATES

boot:'boot',
preloader:'preloader',
mainMenu:'mainMenu',
pve:'pve',
pvp:'pvp',


//SPRITES

preloader_logo: 'preloader_logo',

player: 'player_',

background: 'background',
bombable: 'bombable',
wall:'wall',
portal:'portal',

powerUpBombUp:'powerUpBombUp',
powerUpFlameUp:'powerUpFlameUp',
powerUpSpeedUp:'powerUpSpeedUp',
pointsUp:'pointsUp',
pointsUpPlus:'pointsUpPlus',

bomb:'bomb',
flame:'flame',

enemy: 'enemy',
enemy_0:'enemy_0',
enemy_1:'enemy_1',
enemy_2:'enemy_2',


//Main Menu sprites

mMenuBG:'mMenuBG',
mMenuButton1:'mMenuButton1',
mMenuButton2:'mMenuButton2',
mMenuTitle:'mMenuTitle',

pausePanel:'pausePanel',
quitToMenu:'quitToMenu',
resume:'resume',

gameOver:'gameOver',
gameOverPvpBg:'gameOverPvpBg',

numbers: 'numbers',
done: 'done',
manyWins: 'wins',

unmuted:'unmuted',
muted:'muted',
volArrow:'volArrow',


//HUD sprites

HUDPoints:'HUDPoints',
HUD2:'HUD2',
HUDPressX:'HUDPressX',
HUDbomb: 'HUDbomb',


//MUSIC AND AUDIO

music:'music',
xplosion:'xplosion',
powerup:'powerup',
portal:'portal',

};

module.exports = keys;

},{}],18:[function(require,module,exports){
'use strict';
const config = require('./config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var BootScene = require('./states/boot_scene.js');

var PreloaderScene = require('./states/preloader_scene.js');

var MainMenu = require('./states/main_menu.js');

var PVEmode = require('./states/pve_mode.js');
var PVPmode = require('./states/pvp_mode.js');

//Adding states
window.onload = function () {
  var game = new Phaser.Game(winWidth, winHeight, Phaser.AUTO, 'game');

  game.state.add(keys.boot, BootScene);
  game.state.add(keys.preloader, PreloaderScene);
  game.state.add(keys.mainMenu, MainMenu);
  game.state.add(keys.pve, PVEmode);
  game.state.add(keys.pvp, PVPmode);

  //and launching
  game.state.start(keys.boot);
};

},{"./config.js":6,"./states/boot_scene.js":30,"./states/main_menu.js":31,"./states/preloader_scene.js":32,"./states/pve_mode.js":33,"./states/pvp_mode.js":34}],19:[function(require,module,exports){
'use strict';

//all the stuff required for the base map
var baseMapData = {

    //required as the map is a [[]] and we need to splice each []
    copyMap: function (map) {
        var copiedMap = [];

        for (var i = 0; i < map.length; i++)
            copiedMap.push(map[i].slice());

        return copiedMap;
    },

    cols: 15, fils: 13, //not really necessary

    playerSpawns:
    [
        { x: 1, y: 1 }, //(squares[1][1])
        { x: 13, y: 1 },
        { x: 1, y: 11 },
        { x: 13, y: 11 },
    ],

    squaresTypes:
    {
        wall: { value: 1, sprite: "wall" },
        wallSP: { value: 2, sprite: "wallSP" },

        free: { value: 0, sprite: "background" },

        bombable: { value: 3, sprite: "bombable" },
        bombableDrop: { value: 4, sprite: "bombableDrop" },

        enemy: { value: 5, sprite: null }, //defined at their factories
        enemyDrop: { value: 6, sprite: null },

        bomb: { value: 7, sprite: null },
    },

    squares: //all values at squaresTypes ^
    [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],

    //generates a map randomly (to make pve endless)
    rndGeneration: function (game, level) {

        const tutorialEnemies = 3;
        const tutorialDrops = 1;
        const baseEnemies = 4;

        const portalId = 0;
        const diffTiers = 3;

        const maxMinEnemies = 8;
        const minDrops = 2;
        const maxDrops = 3; //only when maxMinEnemies

        //between and including min and max (Phaser)
        var extraWalls = game.rnd.integerInRange(6, 8);
        var bombables = game.rnd.integerInRange(33, 36);
        var powerUps = [1, 2, 2]; //always the same
        var theme = "basic"; //not used atm

        var enemies, structedEnemies = [], enemiesDrops = [portalId];

        //level 0 affected for tutorial purposes
        if (level === 0) {
            structedEnemies.push(tutorialEnemies);
            enemiesDrops.push(tutorialDrops);
        }
        else {
            //there is a max so level 9, 10, 11 and so over are generated equally
            var minEnemies = baseEnemies + level;
            if (minEnemies > maxMinEnemies) minEnemies = maxMinEnemies;

            enemies = game.rnd.integerInRange(minEnemies, minEnemies + 1); //some rnd

            if (minEnemies === maxMinEnemies)
                enemiesDrops.push(game.rnd.integerInRange(minDrops, maxDrops));
            else enemiesDrops.push(minDrops);

            var structedEnemies = [];
            var max = diffTiers;
            if (level === 1) max--; //level 1 - 2 have less enemy types

            for (var i = 0; i < max; i++) {
                if (i === max-1) n = enemies;
                else var n = game.rnd.integerInRange(0, enemies);
                structedEnemies.push(n);
                enemies -= n;
            }
        }

        return { //an object just like in mapDataBase
            extraWalls: extraWalls,
            bombables: bombables,
            powerUps: powerUps,
            enemies: structedEnemies,
            enemiesDrops: enemiesDrops,
            theme: theme,
        }
    }

};

module.exports = baseMapData;

},{}],20:[function(require,module,exports){
'use strict';

//contains the different tiers, and inside the power ups
var levelDataBase = [

    [ //world 0, used for the presentation - to showcase stuff
        {   //0 - just nothing
            extraWalls: 0,
            bombables: 1,
            powerUps: [1],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1 - basic generation
            extraWalls: 8,
            bombables: 33,
            powerUps: [1, 15],
            enemies: [0],
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //2 - enemy IA
            extraWalls: 6,
            bombables: 1,
            powerUps: [1],
            enemies: [3, 2, 4],
            enemiesDrops: [0, 3],
            theme: "basic"
        },
    ],

    [ //world 1, actually there is only 1 atm
        {   //0 - PVP with basic theme
            extraWalls: 0,      //always 0 too, so no unfairness
            bombables: 80,      //some bombables drop power ups
            powerUps: [0, 20],  //always 0 stairs //[0, 15, 5]
            enemies: [0],       //always 0
            enemiesDrops: [0],
            theme: "basic"
        },
        {   //1
            extraWalls: 8,
            bombables: 33,      //some bombables drop power ups
            powerUps: [1, 2, 2],    //first 1 portal, 2 tier 1 power ups...
            enemies: [3],       //3 tier 0 enemies
            enemiesDrops: [0, 2],//they could drop portals but nope
            theme: "basic"
        },
        {   //2
            extraWalls: 6,
            bombables: 35,
            powerUps: [1, 2, 2],
            enemies: [3, 2], //[3,2]
            enemiesDrops: [0, 2],
            theme: "basic"
        },
        {   //3
            extraWalls: 6,
            bombables: 35,
            powerUps: [1, 1, 2], //?
            enemies: [0, 0, 9], //[0,0,9]
            enemiesDrops: [0, 1], //?
            theme: "basic" //"wood"
        },
        {   //4
            extraWalls: 6,
            bombables: 36,
            powerUps: [1, 2, 2],
            enemies: [3, 2, 4],
            enemiesDrops: [0, 2],
            theme: "basic"
        },
        {   //5
            extraWalls: 6,
            bombables: 36,
            powerUps: [1, 2, 2],
            enemies: [0, 3, 5],
            enemiesDrops: [0, 1],
            theme: "basic"
        },
        //no more cause we instead use the rnd generation
    ]
];

module.exports = levelDataBase;

},{}],21:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const GameObject = require('../objects/gameObject.js');
const Physical = require('../objects/physical.js');
const Bombable = require('../objects/bombable.js');
const Enemy = require('../enemy/enemy.js');
const Flame = require('../enemy/flame.js');

const Id = require('../id/identifiable.js').Id; //for bombable id

const Portal = require('./portal.js'); //next level portal
const portalId = new Id(0, 0); //specific id for the portal

const Point = require('../general/point.js');
const baseMapData = require("./baseMapData.js"); //base map and spawns
const levelsDataBase = require("./levelsDataBase.js"); //base map and spawns

const debugPos = config.debugMapPos;
const debugColor = config.debugColor;

//default map tiles values
const defaultBodyOffset = config.defaultBodyOffset;
const defaultImmovable = config.defaultImmovable;
const defaultBombableLives = config.defaultBombableLives;
const defaultBombableInvencibleTime = config.defaultBombableInvencibleTime;

//too import a big chunk of code
const mapCooking = require('./mapCooking.js');
const deathZoneTimeStart = config.deathZoneTimeStart;
const deathZoneTimeLoop = config.deathZoneTimeLoop;

//contructor, stores the map and much data. Generates itself, the next level, etc.
//also used by players and enemies for the sooth movement - checking the virtual map
function Map(game, worldNum, levelNum, groups, tileData, maxPlayers, pvpMode) {

    this.game = game;
    this.groups = groups;
    this.tileData = tileData;
    this.maxPlayers = maxPlayers;

    this.pvpMode = pvpMode; //different behavior (next level, battle royale)

    if (pvpMode) { //for the battle royale
        this.deathZoneTimer = this.game.time.create(false);
        this.deathZoneTimerEvent = undefined;
        this.deathZoneCallback = undefined;
    }

    //Always same base map values
    this.cols = baseMapData.cols;
    this.fils = baseMapData.fils;
    this.types = baseMapData.squaresTypes;
    this.playerSpawns = baseMapData.playerSpawns;

    //in case of endless_rnd_map_gen the generation will be rnd
    if (config.endless_rnd_map_gen && !this.pvpMode) this.rndGen = 0;
    this.generateMap(worldNum, levelNum);

    if (pvpMode) this.restartDeathZoneCountdowns();
};

//Generate a ring of flames to make the arena smaller
Map.prototype.battleRoyale = function () {

    //the ring's size is based on this.deathZoneExpansion
    //first upper row, then the last row, then both columns
    for (var col = this.deathZoneExpansion; col < this.map[0].length - this.deathZoneExpansion; col++) {
        var squareIndexPos = new Point(col, this.deathZoneExpansion).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }
    for (var col = this.deathZoneExpansion; col < this.map[0].length - this.deathZoneExpansion; col++) {
        var squareIndexPos = new Point(col, this.map.length - 1 - this.deathZoneExpansion).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }

    for (var fil = 1 + this.deathZoneExpansion; fil < this.map.length - 1 - this.deathZoneExpansion; fil++) {
        var squareIndexPos = new Point(this.deathZoneExpansion, fil).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }
    for (var fil = 1 + this.deathZoneExpansion; fil < this.map.length - 1 - this.deathZoneExpansion; fil++) {
        var squareIndexPos = new Point(this.map[0].length - 1 - this.deathZoneExpansion, fil).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }

    this.deathZoneExpansion++;
}

//Re/starts the countdown to the battleRoyale mode
Map.prototype.restartDeathZoneCountdowns = function () {
    this.deathZoneExpansion = 0;
    this.deathZoneStarted = false; //used by hud

    //stop and remove events
    this.deathZoneTimer.stop();
    if (this.deathZoneCallback !== undefined) this.game.time.events.remove(this.deathCallback);
    if (this.deathZoneTimerEvent !== undefined) this.deathZoneTimer.remove(this.deathZoneTimerEvent);

    //start event + the timer
    this.deathZoneTimerEvent = this.deathZoneTimer.add(deathZoneTimeStart, stopAndCall, this);
    this.deathZoneTimer.start();

    function stopAndCall() { //just intermediate
        this.deathZoneStarted = true;
        this.deathZoneTimer.stop();
        this.deathZoneExpansionFunction();
    }
}

//Death zone stopping function, stops timer and events used by hud (+this.deathZoneStarted = true;)
Map.prototype.deathZoneStop = function () {
    this.deathZoneStarted = true;
    this.deathZoneTimer.stop();
    if (this.deathZoneCallback !== undefined) this.game.time.events.remove(this.deathCallback);
    if (this.deathZoneTimerEvent !== undefined) this.deathZoneTimer.removeAll();
}

//Death zone expansion function, calls itself in a loop
Map.prototype.deathZoneExpansionFunction = function () {
    this.battleRoyale();
    this.deathZoneCallback = this.game.time.events.add(deathZoneTimeLoop, this.deathZoneExpansionFunction, this);
}

//gets data of specified map from levelsDataBase and then cooks+build
Map.prototype.generateMap = function (worldNum, levelNum) {

    this.map = baseMapData.copyMap(baseMapData.squares); //copy

    this.mapNumber = { world: worldNum, level: levelNum };

    //different generation
    if (config.endless_rnd_map_gen && !this.pvpMode) {
        this.levelData = baseMapData.rndGeneration(this.game, this.rndGen);
        this.rndGen++;
    }
    else this.levelData = levelsDataBase[worldNum][levelNum];

    //generates the arrays prior map cooking
    this.bombableIdsPowerUps = this.generateIdsPowerUps(this.levelData.powerUps);
    this.enemiesIdsPowerUps = this.generateIdsPowerUps(this.levelData.enemiesDrops);
    this.enemiesTypeNumbers = this.generateEnemiesTypeNumbers(this.levelData.enemies);

    this.cookMap(); //takes all the data and inserts it rnd to get a generated array map

    this.buildMap(this.groups, this.tileData); //uses the array and created the objects
}

//Generates a new map (resets groups and players'positions)
Map.prototype.generateNewMap = function (worldNum, levelNum) {

    this.game.time.events.removeAll(); //required cause we are going to destry
    this.game.debug.reset(); //required cause we are going to destry
    this.groups.clearGroups(this.game); //clears all grups but player
    // console.log(this.game.time.events.events);

    this.mapNumber = { world: worldNum, level: levelNum };
    this.generateMap(worldNum, levelNum);

    this.groups.player.callAll('respawn'); //resets players' pos
    if (this.pvpMode) this.restartDeathZoneCountdowns();
};

//Regeneration the same map
Map.prototype.regenerateMap = function () {
    if (config.endless_rnd_map_gen && !this.pvpMode) this.rndGen--;
    this.generateNewMap(this.mapNumber.world, this.mapNumber.level);
};

//Generation of the next map
Map.prototype.generateNextMap = function () { //based on number of levels in the world

    //if endless, no need to touch the mapNumber
    if (config.endless_rnd_map_gen) this.generateNewMap(this.mapNumber.world, this.mapNumber.level);

    //changles level and if it is the last one changes world
    else {
        if (levelsDataBase[this.mapNumber.world].length === this.mapNumber.level + 1) {
            //little debug in case of last level (avoid crash)
            if (levelsDataBase.length === this.mapNumber.world + 1)
                this.game.debug.text(this.mapNumber.world + " , " + this.mapNumber.level
                    + " is the last map...", debugPos.x, debugPos.y, debugColor);

            else this.generateNewMap(this.mapNumber.world + 1, 0);
        }
        else this.generateNewMap(this.mapNumber.world, this.mapNumber.level + 1);
    }
};

//Adds all the extra bombables (drop too) and walls into the map
Map.prototype.cookMap = mapCooking.cookMap;
//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = mapCooking.getFreeSquares;
//generates the array of random powerUps based on levelsDataBase info
Map.prototype.generateIdsPowerUps = mapCooking.generateIdsPowerUps;
//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
Map.prototype.removeSurroundingSquares = mapCooking.removeSurroundingSquares;
//generates the list of enemies based on levelsDataBase
Map.prototype.generateEnemiesTypeNumbers = mapCooking.generateEnemiesTypeNumbers;


//creates all elements in their respective positions etc
Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.fils; j++) {

            var squareIndexPos = new Point(i, j).applyTileData(tileData);
            var bombableIdPowerUp, enemyIdPowerUp;

            switch (this.map[j][i]) {

                case this.types.bombableDrop.value:
                    bombableIdPowerUp = this.bombableIdsPowerUps.pop(); //gets an Id

                case this.types.bombable.value:
                    //exception for the nextlevel portal creation -> Id tier 0 num 0
                    if (!checkPortal.call(this, tileData))
                        groups.box.add(new Bombable(this.game, this, groups, squareIndexPos,
                            this.types.bombable.sprite, tileData.Scale, tileData.Res,
                            defaultBodyOffset, defaultImmovable,
                            defaultBombableLives, defaultBombableInvencibleTime, bombableIdPowerUp));

                    bombableIdPowerUp = undefined; //resets the id

                //no break so there is background underneath
                case this.types.free.value:
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    break;


                case this.types.enemyDrop.value: //TODO: enemies type not based on level info
                    enemyIdPowerUp = this.enemiesIdsPowerUps.pop(); //gets an Id

                case this.types.enemy.value:
                    //adding floor too
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    groups.enemy.add(new Enemy(this.game, squareIndexPos,
                        this, this.enemiesTypeNumbers.pop(), tileData, groups, enemyIdPowerUp));

                    enemyIdPowerUp = undefined; //resets the id
                    break;


                case this.types.wallSP.value: //no special tile atm
                case this.types.wall.value:

                    groups.wall.add(new Physical(this.game, squareIndexPos,
                        this.types.wall.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable)); //no more needed

                    break;
            }
        }
    }

    //checks and creates the portal
    function checkPortal(tileData) {
        //checks the id to see if it is the portal
        var portal = (bombableIdPowerUp !== undefined
            && bombableIdPowerUp.tier === portalId.tier
            && bombableIdPowerUp.num === portalId.num);

        if (portal) //creates the portal too
        {
            groups.box.add(new Portal(this.game, this, groups,
                squareIndexPos, this.types.bombable.sprite, tileData,
                defaultBodyOffset, defaultImmovable,
                defaultBombableLives, defaultBombableInvencibleTime));
        }

        return portal;
    }
};


//updates the virtual map data of a static object*
Map.prototype.updateSquare = function (position, squareType, extraOffset) {

    //calculate the map position
    var mapPosition = new Point(position.x, position.y);
    mapPosition.reverseTileData(this.tileData, extraOffset);

    this.map[mapPosition.y][mapPosition.x] = squareType;
}

//given a square position returns true if given direction is free
Map.prototype.isNextSquareFree = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return this.map[y][x] === this.types.free.value;
}

//given a square position returns an array of the surrounding free ones
Map.prototype.getSurroundingFreeSquares = function (positionMap) {

    var surroundings = [];
    const dirs = [new Point(1, 0), new Point(-1, 0), new Point(0, 1), new Point(0, -1)];

    //checks all the dirs
    for (var i = 0; i < dirs.length; i++)
        if (this.isNextSquareFree(positionMap, dirs[i]))
            surroundings.push(dirs[i]);

    return surroundings;
}

//given a square position returns true if in given direction there is not a wall
//not merged with nextPos or isNextFree because the flame expansion is partucular
Map.prototype.isNextSquareNotWall = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return (this.map[y][x] !== this.types.wallSP.value
        && this.map[y][x] !== this.types.wall.value);
}

module.exports = Map;

},{"../config.js":6,"../enemy/enemy.js":7,"../enemy/flame.js":9,"../general/point.js":13,"../id/identifiable.js":15,"../objects/bombable.js":24,"../objects/gameObject.js":25,"../objects/physical.js":26,"./baseMapData.js":19,"./levelsDataBase.js":20,"./mapCooking.js":22,"./portal.js":23}],22:[function(require,module,exports){
'use strict';

const Point = require('../general/point.js');

const Id = require('../id/identifiable.js').Id; //for bombable id
const tierSize = require('../id/identifiable.js').tierSize; //for the rnd gen

//will be imported by the map
const mapCooking = {

//Adds all the extra bombables (drop too) and walls into the map
cookMap: function() {

    var self = this; //instead of apply this time
    var freeSquares = this.getFreeSquares(this.maxPlayers);

    //first generates the bombables with the drops and without
    var bombableDrops = this.bombableIdsPowerUps.length;
    insertRnd(bombableDrops, this.types.bombableDrop.value);
    insertRnd(this.levelData.bombables-bombableDrops, this.types.bombable.value);

    //the walls
    insertRnd(this.levelData.extraWalls, this.types.wall.value);

    //last the enemies, staring with the drops
    var enemiesDrops = this.enemiesIdsPowerUps.length;
    insertRnd(enemiesDrops, this.types.enemyDrop.value);
    insertRnd(this.enemiesTypeNumbers.length-enemiesDrops, this.types.enemy.value);

    //inserts a given number of elements (of given type) in the map array free squares (rnd)
    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1);
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map[y][x] = type;

            //special odd wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0)
                self.removeSurroundingSquares(x,y,2,freeSquares)
            else freeSquares.splice(rnd,1); //removes from list
        }
    }
},

//gets the free squares of map excluding player pos
getFreeSquares: function(maxPlayers) {
    var freeSquares = [];

    for (var i = 0; i < this.fils; i++)
        for (var j = 0; j < this.cols; j++)
            if (this.map[i][j] == 0 /*&& !checkPlayerSquare(j,i,maxPlayers)*/)
                freeSquares.push({x: j, y: i});

    //now we search and remove the players spawns and surroundings
    for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
        this.removeSurroundingSquares(
            this.playerSpawns[numPlayer].x, this.playerSpawns[numPlayer].y, 1, freeSquares);

    return freeSquares;

    // // //to compare directly instead of searching after (was my first aproach)
    // // //the newer implementation searches and removes, so worse case => as complex as this
    // // //the newer is better too because is a shared method (used in map generation)
    // // /*function checkPlayerSquare (x,y,maxPlayers) {
    // //     for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
    // //         if ((x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y)
    // //         || (x == map.playerSpawns[numPlayer].x-1 && y == map.playerSpawns[numPlayer].y)
    // //         || (x == map.playerSpawns[numPlayer].x+1 && y == map.playerSpawns[numPlayer].y)
    // //         || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y-1)
    // //         || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y+1))
    // //             return true;
    // // }*/
},

//generates the array of random powerUps based on levelsDataBase info
//given a tier and number of powerUps generates the specific Ids from the tiers (rnd)
generateIdsPowerUps: function (powerUps) {

    var Ids = [];

    for (var tier = 0; tier < powerUps.length; tier++) {
        for (var n = 0; n < powerUps[tier]; n++) {
            //between and including min and max (Phaser)
            var rnd = this.game.rnd.integerInRange(0, tierSize(tier)-1);
            Ids.push(new Id(tier, rnd));
        }
    }

    return Ids;
},

//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
//removes the given square too? atm yes
removeSurroundingSquares: function(x, y, radius, freeSquares) {

    //Will be used with findIndex *(not supported in IE)*
    function equal (e) {
        return e.x === x_toFind
            && e.y === y_toFind;
    };

    var index; //search and store index
    var x_toFind = x, y_toFind = y; //tmp

    //first search: given square
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //second and third searches: horizontal
    x_toFind = x - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    x_toFind = x + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //last two: vertical (reset x required)
    x_toFind = x; y_toFind = y - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    y_toFind = y + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);
},

//generates the list of enemies based on levelsDataBase
generateEnemiesTypeNumbers: function (enemies) {
    var typeNumbers = [];

    for (var type = 0; type < enemies.length; type++)
    for (var n = 0; n < enemies[type]; n++)
    typeNumbers.push(type);

    return typeNumbers;
},

}

module.exports = mapCooking;

},{"../general/point.js":13,"../id/identifiable.js":15}],23:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Bombable = require('../objects/bombable.js');
const Point = require('../general/point.js');
const Enemy = require('../enemy/enemy.js'); //to spawn them

const defaultEnemyType = config.defaultEnemyType;

//Portal objects' data
const portalImmovable = config.portalImmovable;
const portalInvencible = config.portalInvencible;

const portalSprite = config.keys.portal;
const portalDropId = config.portalDropId; //always
const portalSpinVel = config.portalSpinVel;

const portalBombTimer = config.portalBombTimer; //to sync with flames
const portalSpawnTimer = config.portalSpawnTimer; //cooldown to spawn enemies

const portalAnchor = config.portalAnchor;

var portalSound;

//Portal constructor. Inherits from Bombable
//Works as a simple bombable, but then transforms into the portal when hitted
//Used by players to advance to next level + if hitted spawn enemies
function Portal(game, level, groups, position, sprite, tileData, bodyOffSet, immovable, lives, invencibleTime) {

    this.tileData = tileData;
    this.level = level;

    Bombable.call(this, game, level, groups, position, sprite,
        this.tileData.Scale, this.tileData.Res, bodyOffSet, immovable,
        lives, invencibleTime, portalDropId)

    this.animations.add("darken");

    this.spawned = false;
    this.loadNext = false;

    this.portalSound = game.add.audio('portal');
}

Portal.prototype = Object.create(Bombable.prototype);
Portal.prototype.constructor = Portal;


//checks flames, and if spawned spins + spawns enemies on hit. Also tps the player
Portal.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update

    if (this.spawned) {
        this.rotation += portalSpinVel;

        //only go yo next level if there are no more enemies
        if (this.groups.enemy.children.length === 0) {
            this.game.physics.arcade.overlap(this, this.groups.player, nextLevel);
            if (this.loadNext) this.level.generateNextMap();
        }
    }

    function nextLevel(portal, player) {
        portal.loadNext = true;
        portal.portalSound.stop();
    }
}

//extends bombable die
Portal.prototype.die = function () {

    if (this.spawned) this.game.time.events.add(portalBombTimer + 5, this.spawnEnemie, this);

    else {
        this.lives--;

        if (this.lives <= 0) //spawn the portal
        {
            this.animations.play("darken", 15);
            this.game.time.events.add(portalBombTimer + 5, this.spawnPortal, this);
        }
    }
    this.game.time.events.add(portalSpawnTimer, flipInven, this);

    function flipInven() { this.tmpInven = false; }
}

//switches the box into the portal
Portal.prototype.spawnPortal = function () {

    this.spawned = true; //bool for the state
    this.groups.portal.add(this); //changes its group
    this.level.updateSquare(this.position, this.level.types.free.value); //update map

    this.body.width /= 2; //changes its body (smaller)
    this.body.height /= 2;
    this.body.offset = new Point(
        this.body.width * this.tileData.Scale.y,
        this.body.height * this.tileData.Scale.x);

    this.position = new Point( //moves and anchors to spin nicely
        this.body.position.x + this.body.width,
        this.body.position.y + this.body.height);
    this.anchor.setTo(portalAnchor.x, portalAnchor.y);

    this.portalSound.loopFull(0.3);
    this.loadTexture(portalSprite); //change sprite
}

//spawns an enemy when hitted
Portal.prototype.spawnEnemie = function () {

    var enemyPos = new Point(
        this.position.x - this.body.width, //corrects the anchor
        this.position.y - this.body.height);

    this.groups.enemy.add(new Enemy(this.game, enemyPos,
        this.level, defaultEnemyType, this.tileData, this.groups, portalDropId));
}


module.exports = Portal;

},{"../config.js":6,"../enemy/enemy.js":7,"../general/point.js":13,"../objects/bombable.js":24}],24:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Physical = require('./physical.js'); //father
//some drop powerUps
const Identifiable = require('../id/identifiable.js');

//default bombable values
const bombableTimer = config.bombableTimer; //to sync with flames

const alphaWavingSpeed = config.alphaWavingSpeed;
const playerInitialAlphaAngle = config.playerInitialAlphaAngle; //sin(playerInitialAlphaAnlge) -> alpha
const step = config.step; //degrees

//Inherits from Physical
//Makes objects vulneable (interacts with flames)
function Bombable(game, level, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencibleTime, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.animations.add("darken"); //simple animation

    this.groups = groups;
    this.level = level;

    //allows special blocks, enemies, etc
    this.lives = lives;
    this.tmpInven = false; //flip flop
    this.dead = false;

    //Initial invencible time or not
    this.endInvencibilityCallback = undefined;
    if (invencibleTime === 0) this.invencible = false;
    else if (invencibleTime === -1) this.invencible = true; //invencible 4ever
    else {
        this.invencible = true;
        this.endInvencibilityCallback = this.game.time.events.add(invencibleTime, this.endInvencibility, this);
    }

    this.dropId = dropId; //drops powerups
    this.counterAngle = playerInitialAlphaAngle * step; //used for the invencible alpha waving
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;

//children bombables will extend this
Bombable.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//Checls overlap with flames, and if vulneable and not dead then calls die()
Bombable.prototype.checkFlames = function () {

    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
        this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability() {
        return (!this.invencible && !this.tmpInven);
    }

    function onFire(bombable, flame) {
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        this.die(flame);
    }
}

//changes alpha to simulate being invulnerable
Bombable.prototype.invencibleAlpha = function () {

    var tStep = Math.sin(this.counterAngle);

    this.counterAngle += step * alphaWavingSpeed;

    //only positive sin (no negative alpha)
    if (this.counterAngle >= (180 - playerInitialAlphaAngle) * step) {
        this.counterAngle = playerInitialAlphaAngle * step;
    }

    this.alpha = tStep;
}

//player, bomb, enemie, etc will extend this
//in this case reduces lives and if 0, destroys and drops de powerUps
Bombable.prototype.die = function () {
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        // this.visible = false;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer - 5, drop, this);

        //then destroy the bombable
        this.animations.play("darken", 15);
        this.game.time.events.add(bombableTimer + 5, updateAndDestroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);


    function flipInven() { this.tmpInven = false; }
    function drop() {

        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
    function updateAndDestroy() {

        this.level.updateSquare(this.position, this.level.types.free.value)
        this.destroy();
    }
}

//Usesd as callback to remove te temporal inbvulnerability
Bombable.prototype.endInvencibility = function () {
    this.alpha = 1;
    this.invencible = false;
}
//To correctly cancel the callback (if exists)
Bombable.prototype.endlessInvencibility = function () {

    if (this.endInvencibilityCallback !== undefined)

        this.game.time.events.remove(this.endInvencibilityCallback);

    this.invencible = true;
}

module.exports = Bombable;

},{"../config.js":6,"../id/identifiable.js":15,"./physical.js":26}],25:[function(require,module,exports){
'use strict';

//Inherits from Phaser.Sprite
function GameObject (game, position, sprite, scale) {

    Phaser.Sprite.call(this, game, position.x, position.y, sprite);

    //need to add it to the game
    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);
};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;

},{}],26:[function(require,module,exports){
'use strict';

const GameObject = require('./gameObject.js');

//Inherits from Phaser's GameObject
function Physical(game, position, sprite, scale, bodySize, bodyOffSet, immovable) {

    GameObject.call(this, game, position, sprite, scale);

    //enables physics
    game.physics.arcade.enable(this);

    this.body.setSize(bodySize.x, bodySize.y, bodyOffSet.x, bodyOffSet.y);
    this.body.collideWorldBounds = true;

    this.body.immovable = immovable; //if static then immovable
}

Physical.prototype = Object.create(GameObject.prototype);
Physical.prototype.constructor = Physical;

module.exports = Physical;

},{"./gameObject.js":25}],27:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Bombable = require('../objects/bombable.js'); //father
const Flame = require('../enemy/flame.js');

const Point = require('../general/point.js');
const Identifiable = require('../id/identifiable.js');


//default bomb values
const bombBodySize = config.bombBodySize; //little smaller
const bombBodyOffset = config.bombBodyOffset;
const bombExtraOffset = config.bombExtraOffset; //reaquired because bomb body is not full res

const bombImmovable = config.bombImmovable;
const bombInvecibleTime = config.bombInvecibleTime;

const bombLives = config.bombLives;
const bombPower = config.bombPower;
const bombTimer = config.bombTimer;
const bombFlameTimer = config.bombFlameTimer;

const bombSpritePath = config.keys.bomb;

//Bomb constructor. Inherits from Bombable
//The player creates bombs, with given mods such as +flames (more radius)
//after some time explodes and creates flames, bombs can explode each other
function Bomb (game, level, position, tileData, groups, player, bombMods) {

    var bombPosition = new Point (position.x, position.y)
        .add(bombExtraOffset.x, bombExtraOffset.y); //add extra offset

    Bombable.call(this, game, level, groups, bombPosition, bombSpritePath,
        tileData.Scale, bombBodySize, bombBodyOffset, bombImmovable,
        bombLives, bombInvecibleTime);

    this.timer = bombTimer;
    this.flameTimer = bombFlameTimer;
    this[config.flameKey] = bombPower;

    this.groups = groups;
    this.player = player; //link to restore bomb etc
    this.level = level;
    this.tileData = tileData;

    this.animations.add("red"); //animations
    this.animations.play("red", 3/2);
    this.xplosionSound = game.add.audio('xplosion'); //sound

    this.mods = [];
    Identifiable.applyMods(bombMods, this);

    this.xploded = false;
    // // //this.flamesEvent = undefined; //need to create it for die()
    this.xplosionEvent =
        game.time.events.add(this.timer, this.xplode, this);

    level.updateSquare(position, level.types.bomb.value); //need to update mapsquare
};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

//in case of bombs, die makes them cancel xplosion and xplode sooner
Bomb.prototype.die = function () {

    this.lives--;

    //cancels the standard callbacks
    if (this.lives <= 0) {
        if (!this.xploded) {
            this.game.time.events.remove(this.xplosionEvent);
            //the bomb doesnt insta xplode but xplodes before the flames are gone
            this.game.time.events.add(bombFlameTimer/2, this.xplode, this);
        }
        //no need to destroy because xplde already destroys
    }

    else this.game.time.events.add(this.bombDieTimer, flipInven, this);
    function flipInven () { this.tmpInven = false; }
}


//removes the bomb, spawns the fames and then removes them
Bomb.prototype.xplode = function() {

    this.xploded = true;
    this.groups.bomb.remove(this); //removes and destroys the bomb
    this.player.numBombs++; //adds a bomb back to the player

    this.xplosionSound.play("", 0, 0.1); //sound

    var flames = this.spawnFlames();

    //pushes the flames into map.flames
    for(var i = 0; i < flames.length; i++) this.groups.flame.add(flames[i]);

    //callback to destroy the flames
    this.game.time.events.add(this.flameTimer, removeFlames, this);

    function removeFlames () {
        //.destroy() removes them from the group too
        for(var i = 0; i < flames.length; i++) flames[i].destroy();

        //update map
        this.level.updateSquare(this.position, this.level.types.free.value, bombExtraOffset);
        this.destroy(); //destroy the bomb object
    }
}

//spawns the first flame and calls expandFlames
Bomb.prototype.spawnFlames = function() {

    //initial flame postion (corrected offset even though then is the same)
    var positionMap = new Point (this.position.x, this.position.y)
        .subtract(bombExtraOffset.x, bombExtraOffset.y);

    var flames = [new Flame(this.game, positionMap, this.scale, this.player)];

    //xpand flames (instantly) expands the flames to the max radius
    return this.expandFlames(flames, positionMap);
}

//expands (and creates) the extra flames
Bomb.prototype.expandFlames = function(flames, positionMap) {

    //Tries to expand in each direction one by one
    var directions = [new Point(-1,0), new Point(1,0), new Point(0,-1), new Point(0,1)];
    for (var i = 0; i < directions.length; i++) {

        var expansion = 1;
        //these all could be the same, but allow us to know exactly what fails
        var obstacle = false, bombable = false, bomb = false;

        //tmp Position for the initial expanded flame
        var tmpPositionMap = new Point (positionMap.x, positionMap.y)
            .reverseTileData(this.tileData, bombExtraOffset);

        while(expansion <= this[config.flameKey] && !obstacle && !bombable && !bomb) {

            //checks if the next square is free
            if (this.level.isNextSquareNotWall(tmpPositionMap, directions[i])) {

                //updates tmp position
                tmpPositionMap.add(directions[i].x, directions[i].y);

                //creates the real one for the flame
                var flamePos = new Point (tmpPositionMap.x, tmpPositionMap.y)
                    .applyTileData(this.tileData);

                //creates the flame
                var newFlame = new Flame(this.game, flamePos, this.scale, this.player)
                flames.push(newFlame);
                expansion++;

                //if it touches a box or bomb (or a flame) it stops propagation
                bombable = this.game.physics.arcade.overlap(newFlame, this.groups.box);
                bomb = this.game.physics.arcade.overlap(newFlame, this.groups.bomb);

                // // //but it case of the flame over flame, no new one is generated
                // // //In the original game yes, aswell as there is no delay
                // // /*flame = this.game.physics.arcade.overlap(newFlame, this.groups.flame);
                // // if (!flame) flames.push(newFlame);
                // // else newFlame.destroy();*/
            }
            else {
                obstacle = true; //if obstacle no more expansion
            }
        }
    }
    return flames; //just need to delay this somehow
}


module.exports = Bomb;

},{"../config.js":6,"../enemy/flame.js":9,"../general/point.js":13,"../id/identifiable.js":15,"../objects/bombable.js":24}],28:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Bombable = require('../objects/bombable.js'); //father
const Point = require('../general/point.js');

const Inputs = require('../general/inputs.js');
const Identifiable = require('../id/identifiable.js');
const Id = Identifiable.Id; //the mini factory is in Identifiable
const Bomb = require('./bomb.js');

//default player values
const playerSpritePath = config.keys.player; //partial, to complete with numPlayer

const playerBodySize = config.playerBodySize; //little smaller
const playerBodyOffset = config.playerBodyOffset;
const playerExtraOffset = config.playerExtraOffset; //reaquired because player body is not full res

const playerImmovable = config.playerImmovable;

const playerLives = config.playerLives;
const playerExtraLifePoints = config.playerExtraLifePoints;
const playerNumBombs = config.playerNumBombs;

const playerInvencibleTime = config.playerInvencibleTime;
const playerRespawnedStoppedTime = config.playerRespawnedStoppedTime;
const playerDeathTime = config.playerDeathTime;
const playerLifeTime = config.playerLifeTime;

const playerInitialModsIds = [/*new Id(1, 2), new Id(1, 1), new Id(1, 0)*/];
const playerPVPModsIds = [/*new Id(1, 2), new Id(1, 1), new Id(1, 0)*/]; //funnier
const playerOnDeathModsIds = [new Id(1, 2), new Id(1, 1), new Id(1, 0)]; //removed at deat;

const playerMovAndInputs = require('./playerMovAndInputs.js'); //big chunk of code


//Player constructor. Inherits from Bombable
//Handles controls (bomb + moves), smooths the movements, actually moves
//handles powerUps, enemies, etc overlapping and how player dies
//Animations based on moves too
function Player(game, level, numPlayer, tileData, groups, hudVidas) {

    this.numPlayer = numPlayer;
    this.points = 0;
    this.extraLives = 0;

    //each player edits this part of the hud
    this.hudVidas = hudVidas;
    this.hudVidaAnim = hudVidas[numPlayer].animations.add('Clock');
    this.hudVidaDead = hudVidas[numPlayer].animations.add('Dead', [11]);
    this.hudVidaSpawn = hudVidas[numPlayer].animations.add('Spawn', [0]);

    if (!level.pvpMode) { //if pve then starts the animation
        this.hudVidaAnim.play(config.hudAnimSpeed, true);
        this.hudVidaAnim.onLoop.add(this.die, this, 0, 0);
        this.deathCallback = undefined;
    }

    this.wins = 0; //for pvp
    this.selfKills = 0;
    this.kills = 0;

    this.inputs = new Inputs(game, numPlayer); //based on numPlayer

    //produces respawn position based on playerSpawns[numPlayer]
    this.respawnPos = new Point(level.playerSpawns[numPlayer].x, level.playerSpawns[numPlayer].y)
        .applyTileData(tileData, playerExtraOffset);

    Bombable.call(this, game, level, groups, this.respawnPos, playerSpritePath + this.numPlayer,
        tileData.Scale, playerBodySize, playerBodyOffset, playerImmovable, playerLives, playerInvencibleTime);

    //Player animations
    this.animations.add("walking_left", [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
    this.animations.add("walking_right", [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    this.animations.add("walking_up", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.animations.add("walking_down", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);

    this.animations.add("dying", [32, 33, 34, 35, 36], 10);
    this.animations.add("respawn", [36, 35, 34, 33, 32], 10);

    this.animations.add("spawn", [8], 15);
    this.animations.play("spawn");

    this.restartMovement(); //starts the values

    this.tileData = tileData;
    this.level = level;
    this.groups = groups;
    this.groups.player.add(this); //adds itself to the group

    this[config.bombsKey] = playerNumBombs;
    this.mods = [];
    this.bombMods = [];

    //applies starting powerUps (if existing)
    if (level.pvpMode) Identifiable.addPowerUps(playerPVPModsIds, this);
    else Identifiable.addPowerUps(playerInitialModsIds, this);
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;


//Restarts all movements variables
Player.prototype.restartMovement = function () {
    this[config.speedKey] = playerMovAndInputs.getVel();
    this.dirs = { dirX: new Point(), dirY: new Point };
    this.prioritizedDirs = { first: this.dirs.dirX, second: this.dirs.dirY };
    this.blockedBacktrack = { x: false, y: false, turn: false };
    this.body.velocity = new Point();
}

//Starts the countdown to finish life, false if just starting
Player.prototype.restartCountdown = function (restarting) {
    if (this.deathCallback !== undefined) this.game.time.events.remove(this.deathCallback);

    var time = playerLifeTime;
    if (restarting) time += playerRespawnedStoppedTime;

    this.hudVidaAnim.restart();

    this.deathCallback = this.game.time.events.add(time, this.die, this);
}


//Calls all methods basically
Player.prototype.update = function () {

    this.checkFlames(); //bombable method

    //if dead or invencible already no need to check
    if (!this.dead && !this.invencible) this.checkEnemy();

    //if dead somehow player does nothing
    if (!this.dead) {

        this.checkPowerUps(); //pick up
        this.movementLogic(); //movement smoothed already
        this.bombLogic(); //deploy bombs

        if (this.invencible) this.invencibleAlpha(); //alpha waving

        //pick animations
        if (this.body.velocity.x > 0) {
            this.animations.play("walking_right");
        }
        else if (this.body.velocity.x < 0) {
            this.animations.play("walking_left");
        }
        else if (this.body.velocity.y > 0)
            this.animations.play("walking_down");
        else if (this.body.velocity.y < 0)
            this.animations.play("walking_up");
        else {
            this.animations.stop();
            this.frame = this.stopped_frames;
        }
    }
}


//checks for powerUps and takes them
Player.prototype.checkPowerUps = function () {

    this.game.physics.arcade.overlap(this, this.groups.powerUp, takePowerUp);

    function takePowerUp(player, powerUp) {

        player.mods.push(powerUp.id); //add to the list

        player.addPoints(powerUp.pts); //add points too

        Identifiable.pickPowerUp(powerUp, player); //apply

        powerUp.destroy();
    }
}

//atm simply checks overlapping and calls die
Player.prototype.checkEnemy = function () {
    this.game.physics.arcade.overlap(this, this.groups.enemy, this.die, null, this);
}

//adds points and lives if required
Player.prototype.addPoints = function (pts) {

    this.points += pts;

    //add lives if enough points
    if (this.points >= playerExtraLifePoints) {
        var n = (this.points - this.points % playerExtraLifePoints) / playerExtraLifePoints;

        if (n > this.extraLives) {

            this.extraLives++;
            this.lives++;
        }
    }
}

//reads inputs, fixes direction and then moves
Player.prototype.movementLogic = playerMovAndInputs.movementLogic;
//reads the input, handles multiple keys
//prioritizes keys of the same axis them (last key pressed rules)
Player.prototype.readInput = playerMovAndInputs.readInput;
Player.prototype.prioritizeInputs = playerMovAndInputs.prioritizeInputs;
//very important, and documented... makes the player movement fixed
Player.prototype.fixedDirMovement = playerMovAndInputs.fixedDirMovement;


//all the bomb deploying logic
Player.prototype.bombLogic = function () {
    //flip flop to only deply 1 bomb at a time + check if the player is over a bomb
    if (this.inputs.bomb.button.isDown && !this.inputs.bomb.ff && this[config.bombsKey] > 0
        && !this.game.physics.arcade.overlap(this, this.groups.bomb)) {

        this[config.bombsKey]--;

        var bombPosition = new Point(this.position.x, this.position.y)
            .getMapSquarePos(this.tileData, playerExtraOffset)
            .applyTileData(this.tileData);

        var bombie = new Bomb(this.game, this.level,
            bombPosition, this.tileData, this.groups, this, this.bombMods)
        this.groups.bomb.add(bombie);

        this.inputs.bomb.ff = true;
    }
    else if (this.inputs.bomb.button.isUp) //deploy 1 bomb each time
        this.inputs.bomb.ff = false;
}


//player concrete logic for die
Player.prototype.die = function (flame) {

    // console.log("checking player die");

    this.dead = true; //to disable movement

    this.restartMovement();
    this.animations.play("dying");

    //add kils or selfkills to the respective players (if killed by flame)
    if (flame !== undefined && flame !== this.hudVidas[this.numPlayer] && flame.player !== undefined) {
        if (flame.player !== this) flame.player.kills++;
        else {
            flame.player.selfKills++; //for the show
            this.game.debug.text(" LOL", config.debugPos.x, config.debugPos.y, config.debugColor);
            this.game.time.events.add(playerInvencibleTime, function reset() { this.debug.reset(); }, this.game);
        }
    }

    if (!this.level.pvpMode) {
        this.lives--;

        Identifiable.addPowerUps(playerOnDeathModsIds, this, true); //removes power ups

        this.game.time.events.add(playerDeathTime, this.respawn, this); //adds respawn

        if (config.DEBUG && this.lives <= 0) { //debug
            console.log("P" + this.numPlayer + ", you ded (0 lives)");
        }
    }
    else this.pvpModeDeath(); //different logic

    this.game.time.events.add(playerDeathTime, flipInven, this);
    function flipInven() { this.tmpInven = false; }
}

//no respawn + handle end of the mode
Player.prototype.pvpModeDeath = function () {

    this.game.time.events.add(playerDeathTime, dieAndCheckOver, this); //time for animation

    function dieAndCheckOver() {
        this.visible = false; //no respawn, just invisible
        this.hudVidaDead.play(); //changes hud

        var alive = 0; //controls if there is no one else alive
        for (var i = 0; i < this.groups.player.children.length; i++) {
            if ((this.groups.player.children[i] !== this) && (!this.groups.player.children[i].dead))
                alive++;
        }

        if (alive <= 1) { //adds the win to the respective player
            for (var i = 0; i < this.groups.player.children.length; i++) {
                if (!this.groups.player.children[i].dead)
                    this.groups.player.children[i].wins++;
            }
            this.level.regenerateMap(); //then regenerates the map
        }
    }
}

//Resets the player and many variables
Player.prototype.respawn = function () {

    this.invencible = true;
    this.tmpInven = false;
    this.dead = true; //so he cannot move

    if (this.lives > 0) {
        this.visible = true;
        this.animations.play("respawn");

        this.restartMovement(); //so it doesnt move inside walls

        if (!this.level.pvpMode) this.restartCountdown(true);
        else this.hudVidaSpawn.play();

        this.position = new Point(this.respawnPos.x, this.respawnPos.y);

        //callback to make end player's invulnerability
        this.game.time.events.add(playerInvencibleTime, this.endInvencibility, this);

        //callback used to give back the control to the player
        this.game.time.events.add(playerRespawnedStoppedTime, revive, this);
    }
    else {
        this.hudVidaDead.play(); //dead so invisible
        this.visible = false;
    }

    function revive() {
        //fix for a bug: sometimes the position recives a tick of the velocity...
        //...after the respawn; so we double reset it
        this.position = new Point(this.respawnPos.x, this.respawnPos.y);
        this.dead = false;
    }
}

//just extended to see the player number
Player.prototype.endInvencibility = function () {
    if (config.DEBUG) console.log("P" + this.numPlayer + " invencibility ended");
    this.invencible = false;
    this.alpha = 1;
}


module.exports = Player;

},{"../config.js":6,"../general/inputs.js":12,"../general/point.js":13,"../id/identifiable.js":15,"../objects/bombable.js":24,"./bomb.js":27,"./playerMovAndInputs.js":29}],29:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const Point = require('../general/point.js'); //required

//default movement values
const playerVelocity = config.playerVelocity; //max=playerVelocity+5*10 (depends on powerUps)
const playerVelocityTurning = config.playerVelocityTurning; //140 105
//reduced velocity for the turn so the alignment is much smoother
//does not change with playerVelocity, so what changes is the relative reduction
//a starting -25% playerVelocity, and a max of ~45% (or less)

const playerExtraOffset = config.playerExtraOffset;

//big chunk of code imported by the player
var playerMoveAndInputs = {

//Information required by the player
getVel: function () {return playerVelocity},

//reads inputs, fixes direction and moves
movementLogic: function () {
    this.body.velocity.x = 0; //stops the player
    this.body.velocity.y = 0;

    this.readInput(); //read the input (prioritize it etc)
    var fixedFinalDir = new Point(), fixedExtraDir = new Point();

    //proceed to fix the dir of the first dir
    if (!this.prioritizedDirs.first.isNull()) {
        fixedFinalDir = this.fixedDirMovement(this.prioritizedDirs.first);

        //if turning is not blocked we check the second dir
        //if it is not null ofc; we treat it as the extra
        if (!this.blockedBacktrack.turn && !this.prioritizedDirs.second.isNull()) {
            fixedExtraDir = this.fixedDirMovement(this.prioritizedDirs.second);

            //now if the second fixed dir is different and not null or reversed
            //it is going to substitute the finalDir plus changes the preference
            if (!fixedExtraDir.isEqual(fixedFinalDir) && !fixedExtraDir.isNull()
                && !fixedExtraDir.isEqual(fixedFinalDir.inversed())) {

                fixedFinalDir.x = fixedExtraDir.x;
                fixedFinalDir.y = fixedExtraDir.y;

                //we block the turn and use a callback, required to get smoothness
                this.blockedBacktrack.turn = true;
                this.game.time.events.add(playerVelocityTurning, unlockTurning, this);

                //switching the preference
                if (this.prioritizedDirs.first === this.dirs.dirX) {
                    this.prioritizedDirs.first = this.dirs.dirY;
                    this.prioritizedDirs.second = this.dirs.dirX;
                }
                else {
                    this.prioritizedDirs.first = this.dirs.dirX;
                    this.prioritizedDirs.second = this.dirs.dirY;
                }
            }
        }
    }

    //moves the player (only if dir is not null)
    if (fixedFinalDir.x === 1) this.body.velocity.x = this[config.speedKey];
    else if (fixedFinalDir.x === -1) this.body.velocity.x = -this[config.speedKey];
    else if (fixedFinalDir.y === 1) this.body.velocity.y = this[config.speedKey];
    else if (fixedFinalDir.y === -1) this.body.velocity.y = -this[config.speedKey];

    //callback
    function unlockTurning() { this.blockedBacktrack.turn = false }
},

//reads the input, handles multiple keys
//prioritizes keys of the same axis them (last key pressed rules)
readInput: function () {

    var nextDirX = new Point(); //sparate axis
    var nextDirY = new Point();
    var inputX = [];
    var inputY = [];

    //inputs are stored
    if (this.inputs.mov.left.isDown) inputX.push(-1);
    if (this.inputs.mov.right.isDown) inputX.push(1);
    if (this.inputs.mov.up.isDown) inputY.push(-1);
    if (this.inputs.mov.down.isDown) inputY.push(1);

    //handle double inputX (no backtracking)
    if (inputX.length === 2) { //if two inputs, reverse direction once
        if (this.blockedBacktrack.x) nextDirX = new Point(this.dirs.dirX.x, 0);
        else {
            nextDirX = new Point(-this.dirs.dirX.x, 0);
            this.blockedBacktrack.x = true;
        }
    } //only 1 input, remove blockedBacktrack
    else if (inputX.length === 1) {
        this.blockedBacktrack.x = false;
        nextDirX = new Point(inputX.pop(), 0);
    }

    //handle double inputY (no backtracking)
    if (inputY.length === 2) {
        if (this.blockedBacktrack.y) nextDirY = new Point(0, this.dirs.dirY.y);
        else {
            nextDirY = new Point(0, -this.dirs.dirY.y);
            this.blockedBacktrack.y = true;
        }
    }
    else if (inputY.length === 1) {
        this.blockedBacktrack.y = false;
        nextDirY = new Point(0, inputY.pop());
    }

    this.prioritizeInputs(nextDirX, nextDirY);
},

prioritizeInputs: function (nextDirX, nextDirY) {

    //reset dirs now (had to compare with previous)
    //we do not reset prioritized dirs
    this.dirs.dirX.x = 0;
    this.dirs.dirY.y = 0;

    //if there has been only one input
    //(only really need to compare x or y not both)
    if (nextDirX.isNull() || nextDirY.isNull()) {
        if (!nextDirX.isNull()) {
            this.dirs.dirX.x = nextDirX.x;
            this.prioritizedDirs.first = this.dirs.dirX;
            this.prioritizedDirs.second = this.dirs.dirY;
        }
        else {
            this.dirs.dirY.y = nextDirY.y;
            this.prioritizedDirs.first = this.dirs.dirY;
            this.prioritizedDirs.second = this.dirs.dirX;
        }
    }
    //but if both are defined...
    else if (!nextDirX.isNull() && !nextDirY.isNull()) {
        this.dirs.dirX.x = nextDirX.x;
        this.dirs.dirY.y = nextDirY.y;
    }
},

//very important, and documented... makes the player movement fixed
fixedDirMovement: function (dir) {

    var fixedDir;
    this[config.speedKey] = playerVelocity; //mey be slowed down

    //virtual map pos and extra pos
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, playerExtraOffset);
    var extraPosMap = new Point(this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, playerExtraOffset);

    //first chechs if the virtual map pos + dir is free
    if (this.level.isNextSquareFree(positionMap, dir)) {

        //if the player is perfectly aligned, moves along
        if (extraPosMap.isNull()) {
            fixedDir = new Point(dir.x, dir.y);
        }
        //if dir and extra pos are parallel, moves along
        else if (extraPosMap.isParallel(dir)) {
            fixedDir = new Point(dir.x, dir.y);
        }
        else { //next square is free but the player is not aligned
            //needs to be aligned, moves in negative extraPosMap
            this[config.speedKey] = playerVelocityTurning;
            fixedDir = new Point(-extraPosMap.x, -extraPosMap.y);
        }
    }
    else { //the next square is blocked
        //if the player is perfectly aligned, does nothing
        if (extraPosMap.isNull()) {
            fixedDir = new Point();
        }
        //the player is not aligned, so it means there is room to move
        //it moves along (dir) and gets closer to the blocked square
        else if (extraPosMap.isParallel(dir)) {
            this[config.speedKey] = playerVelocityTurning;
            fixedDir = new Point(dir.x, dir.y);
        }
        else {//if not aligned, moves towards the direction it's leaning to
            //so moves in extraPosMap trying to get around the blocked square
            //**is the only case that needs extra checking the map

            var diagonalDir = new Point(dir.x, dir.y) //calculate diagonal
                .add(extraPosMap.x, extraPosMap.y);

            //check the diagonal square
            if (this.level.isNextSquareFree(positionMap, diagonalDir)) {
                this[config.speedKey] = playerVelocityTurning;
                fixedDir = new Point(extraPosMap.x, extraPosMap.y);
            }
            else fixedDir = new Point(); //if diagonal is blocked too, do nothing
        }
    }
    return fixedDir;
}

}

module.exports = playerMoveAndInputs;

},{"../config.js":6,"../general/point.js":13}],30:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var BootScene = {

      preload: function () {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

        // load here assets required for the loading screen
        //in our case the phaser logo
        this.game.load.image(keys.preloader_logo, 'images/phaser.png');
      },

      create: function () {

        this.game.state.start(keys.preloader);
        if (DEBUG) console.log("Booting...", Date.now()-this.startTime, "ms");
      }
    };

    module.exports = BootScene;

},{"../config.js":6}],31:[function(require,module,exports){
'use strict';
const config = require('../config.js');

const audioHUD = require('../HUD/audioHUD.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

//Menu sprites data
var mMenuTitle; //super bomboooooozle man
const mMenuTitlePos = config.mMenuTitlePos;
const mMenuTitleKey = config.keys.mMenuTitle;

var mMenuBG;
const mMenuBGPos = config.mMenuBGPos;
const mMenuBGScale = config.mMenuBGScale;
const mMenuBGKey = config.keys.mMenuBG;

var mMenuPVE;
const mMenuPVEPos = config.mMenuPVEPos;
const mMenuPVEScale = config.mMenuPVEScale;
const mMenuPVEAnchor = config.mMenuPVPAnchor;
const mMenuPVEKey = config.keys.mMenuButton1;
var mMenuPVP;
const mMenuPVPPos = config.mMenuPVPPos;
const mMenuPVPScale = config.mMenuPVPScale;
const mMenuPVPAnchor = config.mMenuPVPAnchor;
const mMenuPVPKey = config.keys.mMenuButton2;
const buttonCount = config.buttonCount;
//

//Wins selector sprites and other data
var lessWinsButton;
var moreWinsButton;
var doneButton;
var howManyWins;
var numbers;
const numberData = config.numbers;
const doneData = config.doneButton;
const HMWData = config.howManyWins;
//

//These are the variables of the selector of PVP needed wins to finish the game
const minWinsNec = config.minWinsNec;
const maxWinsNec = config.maxWinsNec;

var winsNecessary = config.initWinsNecessary; //base value from config

var MainMenu = {

    preload: function() {
        if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc
    },

    create: function() {

        //background
        mMenuBG = this.game.add.sprite(mMenuBGPos.x, mMenuBGPos.y, mMenuBGKey);
        mMenuBG.scale.y = mMenuBGScale.y; //just a little bigger
        mMenuBG.width = winWidth;
        mMenuBG.heigth = winHeight;

        //two buttons
        mMenuPVE = this.game.add.button(winWidth/2 + mMenuPVEPos.x, winHeight/2 + mMenuPVEPos.y, mMenuPVEKey, this.nextStatePVE, this);
        mMenuPVE.scale.setTo(mMenuPVEScale.x, mMenuPVEScale.y);
        mMenuPVE.anchor.setTo(mMenuPVEAnchor.x, mMenuPVEAnchor.y);

        mMenuPVP = this.game.add.button(winWidth/2 + mMenuPVPPos.x, winHeight/2 + mMenuPVPPos.y, mMenuPVPKey, this.createWinsChoice, this);
        mMenuPVP.scale.setTo(mMenuPVPScale.x, mMenuPVPScale.y);
        mMenuPVP.anchor.setTo(mMenuPVPAnchor.x, mMenuPVPAnchor.y);

        //audio buttons
        audioHUD.init(this.game);
        audioHUD.creation(this.game);

        //title
        mMenuTitle = this.game.add.sprite(mMenuTitlePos.x, winHeight/2 + mMenuTitlePos.y, mMenuTitleKey);
    },

    //Both of them change states
    nextStatePVE: function() { this.game.state.start('pve');  },
    nextStatePVP: function() { this.game.state.start('pvp', true, false, winsNecessary);  },

    //Changes the number of the selector
    changeNumber: function(frame) { numbers.loadTexture(config.keys.numbers, frame); },

    //Logic of the buttons of the selector
    lessWins: function() { if(winsNecessary > minWinsNec) winsNecessary--; this.changeNumber(winsNecessary); },
    moreWins: function() { if(winsNecessary < maxWinsNec) winsNecessary++; this.changeNumber(winsNecessary); },

    //only used in the menu
    createWinsChoice: function() {
        mMenuPVP.inputEnabled = false;

        //numbers
        numbers = this.game.add.sprite(mMenuPVP.position.x + numberData.pos.x, mMenuPVP.y + numberData.pos.y, config.keys.numbers, winsNecessary);
        numbers.scale.setTo(numberData.scale.x, numberData.scale.y);
        numbers.anchor.setTo(numberData.anchor.x, numberData.anchor.y);

        //selector buttons
        lessWinsButton = this.game.add.button(mMenuPVP.position.x + 230, mMenuPVP.position.y, config.keys.volArrow, this.lessWins, this);
        lessWinsButton.scale.setTo(config.lessVolButtonScale.x, config.lessVolButtonScale.y);

        moreWinsButton = this.game.add.button(mMenuPVP.position.x + 290, mMenuPVP.position.y, config.keys.volArrow, this.moreWins, this);
        moreWinsButton.anchor.setTo(config.moreVolButtonAnchor.x, config.moreVolButtonAnchor.y);
        moreWinsButton.scale.setTo(config.moreVolButtonScale.x, config.moreVolButtonScale.y);
        moreWinsButton.angle = config.moreVolButtonAngle;

        //accept button (and launch pvp)
        doneButton = this.game.add.button(numbers.position.x + doneData.pos.x, numbers.position.y + doneData.pos.y, config.keys.done, this.nextStatePVP, this);
        doneButton.scale.setTo(doneData.scale.x, doneData.scale.y);
        doneButton.anchor.setTo(doneData.anchor.x, doneData.anchor.y);

        //sprite
        howManyWins = this.game.add.sprite(numbers.position.x + HMWData.pos.x, numbers.position.y + HMWData.pos.y, config.keys.manyWins);
        howManyWins.scale.setTo(HMWData.scale.x, HMWData.scale.y);
        howManyWins.anchor.setTo(HMWData.anchor.x, HMWData.anchor.y);
    },

    //Updates the audio sprite manager
    update: function() {
        audioHUD.checkVisible();
    }

};

module.exports = MainMenu;

},{"../HUD/audioHUD.js":1,"../config.js":6}],32:[function(require,module,exports){
'use strict';
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

//loads all the assets (sounds, sprites, spritesheets...)
var PreloaderScene = {

    preload: function () {
        if (DEBUG) this.startTime = Date.now();

        //Loading Bar
        this.loadingBar = this.game.add.sprite(winWidth/2, winHeight/2, 'preloader_logo');
        this.loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        //Players and HUD Players
        for (var numPlayers = 0; numPlayers < 4; numPlayers++){
            this.game.load.spritesheet(keys.player+numPlayers, 'images/Sprites/Bomberman/Bomb0'+numPlayers+'+Exploding.png', 64, 86);
            this.game.load.spritesheet(keys.player+numPlayers+'Clock', 'images/Sprites/Bomberman/Bman_'+numPlayers+'Clock.png', 47, 88)
        }

        //Map
        this.game.load.image(keys.background, 'images/Sprites/Blocks/BackgroundTile.png');
        this.game.load.spritesheet(keys.bombable, 'images/Sprites/Blocks/ExplodableBlockAnim.png', 64, 64);
        this.game.load.image(keys.wall, 'images/Sprites/Blocks/SolidBlock.png');
        this.game.load.image(keys.portal, 'images/Sprites/Blocks/Portal.png');

        //PowerUps
        this.game.load.image(keys.powerUpBombUp, 'images/Sprites/Powerups/BombPowerup.png');
        this.game.load.image(keys.powerUpFlameUp, 'images/Sprites/Powerups/FlamePowerup.png');
        this.game.load.image(keys.powerUpSpeedUp, 'images/Sprites/Powerups/SpeedPowerup.png');
        this.game.load.image(keys.pointsUp, 'images/Sprites/Powerups/PointPowerup.png');
        this.game.load.image(keys.pointsUpPlus, 'images/Sprites/Powerups/PointPowerupPlus.png');

        //Bombs
        this.game.load.spritesheet(keys.bomb, 'images/Sprites/Bomb/Bomb_f1.png', 48, 48);
        this.game.load.spritesheet(keys.flame, 'images/Sprites/Flame/flames.png', 48, 48);

        //Enemies
        this.game.load.spritesheet(keys.enemy_0, 'images/Sprites/Creep/creep0.png', 64, 64);
        this.game.load.spritesheet(keys.enemy_1, 'images/Sprites/Creep/creep1.png', 64, 64);
        this.game.load.spritesheet(keys.enemy_2, 'images/Sprites/Creep/creep2.png', 64, 64);

        //Main Menu sprites
        this.game.load.image(keys.mMenuBG, 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image(keys.mMenuButton1, 'images/Sprites/Menu/PVE_mode.png');
        this.game.load.image(keys.mMenuButton2, 'images/Sprites/Menu/PVP_mode.png');
        this.game.load.image(keys.mMenuTitle, 'images/Sprites/Menu/title.png');
        //PVP options
        this.game.load.spritesheet(keys.numbers, 'images/Sprites/Menu/Numbers.png', 64, 137);
        this.game.load.image(keys.done, 'images/Sprites/Menu/Done.png');
        this.game.load.image(keys.manyWins, 'images/Sprites/Menu/HowManyWins.png');

        //Music buttons
        this.game.load.image(keys.unmuted, 'images/Sprites/Menu/unMuted.png');
        this.game.load.image(keys.muted, 'images/Sprites/Menu/Muted.png');
        this.game.load.image(keys.volArrow, 'images/Sprites/Menu/VolumeArrow.png');

        //Pause menu
        this.game.load.image(keys.pausePanel, 'images/Sprites/Menu/White_Panel.png');
        this.game.load.image(keys.quitToMenu, 'images/Sprites/Menu/QuitToMenu.png');
        this.game.load.image(keys.resume, 'images/Sprites/Menu/Resume.png');

        //HUD sprites
        this.game.load.image(keys.HUDPoints, 'images/Sprites/HUD/HUDPoints.png');
        this.game.load.image(keys.HUD2, 'images/Sprites/HUD/HUD2.png');
        this.game.load.image(keys.HUDPressX, 'images/Sprites/HUD/PressX.png');

        this.game.load.image(keys.gameOver, 'images/Sprites/HUD/GameOver.png')
        this.game.load.image(keys.gameOverPvpBg, 'images/Sprites/Menu/overPvp.png')
        this.game.load.image(keys.HUDbomb, 'images/Sprites/HUD/HudBomb.png');

        //Music and audio
        this.game.load.audio(keys.music, 'audio/music.ogg');
        this.game.load.audio(keys.xplosion, 'audio/explosion.ogg');
        this.game.load.audio(keys.powerup, 'audio/powerup.ogg');
        this.game.load.audio(keys.portal, 'audio/portal.ogg');
    },

    create: function () {
        this.game.state.start(keys.mainMenu);
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;

},{"../config.js":6}],33:[function(require,module,exports){
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
const pauseMenu = require('../HUD/pauseMenu.js');
const gameOver = require('../HUD/gameOver.js');
const audioHUD = require('../HUD/audioHUD.js');

const playerInfoHUD = require('../HUD/playerInfoHUD.js');
var playerInfoHUDs;
var HUDBombHead = [];
const BombHUD = require('../HUD/bombHUD.js');
var bombHUD;

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
var players;

const tileData = config.tileData;

//pve mode, up to 2 players, endless (if selected)
var PlayScene = {

  preload: function () {
    this.game.stage.backgroundColor = 'black';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    //audio
    audioHUD.creation(this.game);

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers, pvpMode);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //playerInfoHuds
    playerInfoHUDs = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      playerInfoHUDs.push(new playerInfoHUD(this.game, HUDBombHead, numPlayer, pvpMode));
    }
    if (initialPlayers === 1) playerInfoHUD.drawPressX(this.game);

    bombHUD = new BombHUD(this.game, pvpMode); //little bomb

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

  update: function () {

    //Body colliders
    this.game.physics.arcade.collide(groups.player, groups.wall);
    this.game.physics.arcade.collide(groups.player, groups.box);
    this.game.physics.arcade.collide(groups.player, groups.bomb);

    //Bring textures to the top of the layer
    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work

    //Update all HUD
    for (var numPlayer = 0; numPlayer < playerInfoHUDs.length; numPlayer++)
      playerInfoHUDs[numPlayer].updatePlayerInfoHud(players[numPlayer], pvpMode);

    bombHUD.updateBombHud(level, pvpMode);
    gameOver.checkPve(this.game, players);
    audioHUD.checkVisible();

    //Add player control
    globalControls.addPlayerControl(gInputs, players, maxPlayers, playerInfoHUDs);

    //Debug hacks controls
    if (config.HACKS) {
      globalControls.debugModeControl(gInputs, this.game, groups.player);
      globalControls.resetLevelControl(gInputs, level);
      globalControls.nextLevelControl(gInputs, level);
    }

    //Pause menu control
    pauseMenu.offPauseMenuControl(this.game, gInputs);
  },

  //Paused = pausedCreate on pauseMenu.js
  paused: function () {
    pauseMenu.pausedCreate(audioHUD.music, this.game);
  },

  //Resumed = resumedMenu on pauseMenu.js
  resumed: function () {
    pauseMenu.resumedMenu(audioHUD.music, gInputs, this.game);
  },

  //Renders debug info
  render: function () {
    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }
  },

  //Calls audioHUD destruction in order to destroy all sounds when coming back to the main menu state
  shutdown: function () {
    audioHUD.destruction(this.game);
  },
};

module.exports = PlayScene;

},{"../HUD/audioHUD.js":1,"../HUD/bombHUD.js":2,"../HUD/gameOver.js":3,"../HUD/pauseMenu.js":4,"../HUD/playerInfoHUD.js":5,"../config.js":6,"../general/globalControls.js":10,"../general/groups.js":11,"../general/inputs.js":12,"../general/point.js":13,"../maps/map.js":21,"../player/player.js":28}],34:[function(require,module,exports){
'use strict';
const pvpMode = true;
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

const debugPos = config.debugPos;
const debugColor = config.debugColor;

const Point = require('../general/point.js');

const globalControls = require('../general/globalControls.js');
const pauseMenu = require('../HUD/pauseMenu.js');
const gameOver = require('../HUD/gameOver.js');
const audioHUD = require('../HUD/audioHUD.js');

const playerInfoHUD = require('../HUD/playerInfoHUD.js');
var playerInfoHUDs;
var HUDBombHead = [];
const BombHUD = require('../HUD/bombHUD.js');
var bombHUD;

const Groups = require('../general/groups.js');
var groups;

const Map = require('../maps/map.js');
var level;

var initialMap = config.initialMapPvP;

const Inputs = require('../general/inputs.js');
var gInputs; //global inputs

const Player = require('../player/player.js');
const initialPlayers = config.pvp_initialPlayers;
const maxPlayers = config.pvp_maxPlayers; //needed for the map generation
var players;

const tileData = config.tileData;

var winsNec; //not const, selected by player

var PlayScene = {

  //parameter sent from the menu
  init: function (winsNecessary) {
    winsNec = winsNecessary;
  },

  preload: function () {
    this.game.stage.backgroundColor = 'black';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },


  create: function () {

    //audio
    audioHUD.creation(this.game);

    //map
    groups = new Groups(this.game); //first need the groups
    level = new Map(this.game, initialMap.world, initialMap.level, groups, tileData, maxPlayers, pvpMode);

    //global controls
    gInputs = new Inputs(this.game, -1);

    //playerInfoHuds
    playerInfoHUDs = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++) {
      playerInfoHUDs.push(new playerInfoHUD(this.game, HUDBombHead, numPlayer, pvpMode));
    }
    if (initialPlayers <= 2) playerInfoHUD.drawPressX(this.game, true);

    bombHUD = new BombHUD(this.game, pvpMode); //little bomb

    //player/s (initialPlayers)
    players = [];
    for (var numPlayer = 0; numPlayer < initialPlayers; numPlayer++)
      players.push(new Player(this.game, level, numPlayer, tileData, groups, HUDBombHead));

    if (DEBUG) {
      console.log("Loaded...", Date.now() - this.startTime, "ms");
      console.log("\n PLAYER: ", players[0]);
      console.log("\n MAP: ", level.map);
    }
  },


  update: function () {

    //Body colliders
    this.game.physics.arcade.collide(groups.player, groups.wall);
    this.game.physics.arcade.collide(groups.player, groups.box);
    this.game.physics.arcade.collide(groups.player, groups.bomb);

    //Bring textures to the top of the layer
    this.game.world.bringToTop(groups.flame);
    this.game.world.bringToTop(groups.player); //array doesnt work so group

    //update HUD so no iterate players twice
    for (var numPlayer = 0; numPlayer < playerInfoHUDs.length; numPlayer++)
      playerInfoHUDs[numPlayer].updatePlayerInfoHud(players[numPlayer], pvpMode);

    bombHUD.updateBombHud(level, pvpMode);
    gameOver.checkPvp(this.game, players, winsNec);
    audioHUD.checkVisible();

    //Add player control
    globalControls.addPlayerControl(gInputs, players, maxPlayers, playerInfoHUDs);

    //Debug hacks
    if (config.HACKS) {
      globalControls.debugModeControl(gInputs, this.game, groups.player);
      globalControls.resetLevelControl(gInputs, level);
    }

    //Pause menu control
    pauseMenu.offPauseMenuControl(this.game, gInputs);
  },

  //Paused = pausedCreate on pauseMenu.js
  paused: function () {
    pauseMenu.pausedCreate(audioHUD.music, this.game);
  },

  //Resumed = resumedMenu on pauseMenu.js
  resumed: function () {
    pauseMenu.resumedMenu(audioHUD.music, gInputs, this.game);
  },

  //Renders debug info
  render: function () {
    if (gInputs.debug.state) {
      groups.drawDebug(this.game);
      this.game.debug.bodyInfo(players[0], debugPos.x, debugPos.y, debugColor);
    }
  },

  //Calls audioHUD destruction in order to destroy all sounds when coming back to the main menu state
  shutdown: function () {
    audioHUD.destruction(this.game);
  },
};

module.exports = PlayScene;

},{"../HUD/audioHUD.js":1,"../HUD/bombHUD.js":2,"../HUD/gameOver.js":3,"../HUD/pauseMenu.js":4,"../HUD/playerInfoHUD.js":5,"../config.js":6,"../general/globalControls.js":10,"../general/groups.js":11,"../general/inputs.js":12,"../general/point.js":13,"../maps/map.js":21,"../player/player.js":28}]},{},[18]);
