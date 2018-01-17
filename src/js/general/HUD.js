'use strict';

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

function HUD(game, PvE, music){
    this.game = game;

    this.drawStatic();

    
    
    if(!PvE){
        for (var i = 0; i < 4; i++) {
            this.drawLives(i);
        }
    }
    else {
        for (var i = 0; i < 2; i++)
            this.drawPoints(i);
    }


};


HUD.prototype.constructor = HUD;

HUD.prototype.drawStatic = function () {
    this.HUDBg = game.add.sprite(0, 0, 'HUDBg');
    this.HUDBomb = this.game.add.sprite(width/2, height/60, 'bomb');
    this.HUDBomb.anchor.setTo(0.5, 0);
    this.HUDBomb.scale.setTo(1.2, 1.2);
}

HUD.prototype.drawMusicButtons = function (music){
    function toggleMute() { this.game.sound.mute = !this.game.sound.mute; }
    
    function moreVol() { if(music.volume < 1) music.volume += 0.1; }
    function lessVol () { if(music.volume > 0.2) music.volume -= 0.1; }

    this.muteMusicButton = this.game.add.button(10, 40, 'unmuted', this.toggleMute, this);
    this.muteMusicButton.scale.setTo(0.1, 0.1);
    this.mutedMusicButton = this.game.add.button(10, 40, 'muted', this.toggleMute, this);
    this.mutedMusicButton.scale.setTo(0.1, 0.1);

    this.lessVolButton = this.game.add.button(10, 10, 'volArrow', this.lessVol, this);
    this.lessVolButton.scale.setTo(0.04, 0.04);

    this.moreVolButton = this.game.add.button(30, 10, 'volArrow', this.moreVol, this);
    this.moreVolButton.anchor.setTo(1, 1);
    this.moreVolButton.scale.setTo(0.04, 0.04);
    this.moreVolButton.angle = 180;

    
}

HUD.prototype.drawLives = function (numPlayer) {
    var auxNumPlayer;
    if(numPlayer<2) auxNumPlayer += (numPlayer+1);
    else auxNumPlayer += (numPlayer+3);

    this.HUDBombHead = this.game.add.sprite(auxNumPlayer * width/11, height/60, 'player_'+numPlayer, 8);
    this.HUDBombHead.scale.setTo(0.75, 0.75);
    this.HUD2 = this.game.add.sprite(auxNumPlayer * width/11 + HUDBombHead, height/60, 'HUD2');
    this.HUD2.scale.setTo(0.75, 0.75);
    
    this.livesHUD = this.game.add.text(this.HUD2.position.x + this.HUD2.texture.width, 15, "",
    { font: "45px Comic Sans MS", fill: "#f9e000", align: "center"});
    this.livesHUD.anchor.setTo(0.2, 0);
}

HUD.prototype.drawPoints = function (numPlayer) {
    if(numPlayer==0) numPlayer += 2;
    else numPlayer += 9;
    this.HUDPoints = this.game.add.sprite(width/11, -10, 'HUDPoints');
    this.HUDPoints.scale.setTo(0.75, 0.75);
}

