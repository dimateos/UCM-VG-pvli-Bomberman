'use strict';

var GameObject = require('../objects/gameObject.js');

var livesHUD;
var pointsHUD;
var HUDBg;
var HUDPoints;
var HUDBombHead;
var HUD2;
var HUDBomb;

var muteMusicButton;
var mutedMusicButton;
var lessVolButton;
var moreVolButton;

var width = 800;
var height = 600;

function HUD(game, position, sprite, scale){
    
    GameObject.call(this, game, position, sprite, scale);
    this.game = game;

};

HUD.prototype = Object.create(GameObject.prototype);
HUD.prototype.constructor = HUD;

module.exports = HUD;



