'use strict';

var cb;

function Button (game, position, sprite, scale, callBack, callBackContext) {
    if(callBack===0)
        cb = "lessVol";
    else if(callBack===1)
        cb = "moreVol";
    else
        cb = "toggleMute";

    Phaser.Button.call(this, game, sprite, position.x, position.y, cb, callBackContext);

    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);

};

Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;

Button.prototype.lessVol = function () { if (this.game.sound.volume > 0.2) this.game.sound.volume -= 0.1; }
Button.prototype.moreVol = function () { if (this.game.sound.volume < 1) this.game.sound.volume += 0.1; }
Button.prototype.toggleMute = function () { this.game.sound.mute = !this.game.sound.mute; }

module.exports = Button;
