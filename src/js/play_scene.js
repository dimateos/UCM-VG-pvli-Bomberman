'use strict';

var PlayScene = {
  preload: function () {
    this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');

    logo.anchor.setTo(0.5, 0.5);
    logo.scale.setTo(0.8,0.85); // to fit in the canvas

    console.log("Loaded...", Date.now()-this.startTime, "ms");
  }
};

module.exports = PlayScene;
