'use strict';
const config = require('../../config.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var pausePanel;
var unpauseButton;
var gotoMenuButton;

var pauseMenu = {
    pausedCreate: function (music, game) {
        music.pause();
        game.stage.disableVisibilityChange = true;
        game.input.onDown.add(unPause, this);

        pausePanel = game.add.sprite(winWidth / 2, winHeight / 2, 'pausePanel');
        pausePanel.anchor.setTo(0.5, 0.5);
        pausePanel.alpha = 0.5;

        unpauseButton = game.add.sprite(winWidth / 2, winHeight / 2 - 50, 'resume');
        unpauseButton.anchor.setTo(0.5, 0.5);
        unpauseButton.scale.setTo(0.75, 0.75);

        gotoMenuButton = game.add.sprite(winWidth / 2, winHeight / 2 + 50, 'quitToMenu');
        gotoMenuButton.anchor.setTo(0.5, 0.5);
        gotoMenuButton.scale.setTo(0.75, 0.75);

        function unPause() {
          if (game.paused) {
            if (game.input.mousePointer.position.x > unpauseButton.position.x - unpauseButton.texture.width / 2
              && game.input.mousePointer.position.x < unpauseButton.position.x + unpauseButton.texture.width / 2
              && game.input.mousePointer.position.y > unpauseButton.position.y - unpauseButton.texture.height / 2
              && game.input.mousePointer.position.y < unpauseButton.position.y + unpauseButton.texture.height / 2)
              game.paused = false;

            else if (game.input.mousePointer.position.x > gotoMenuButton.position.x - gotoMenuButton.texture.width / 2
              && game.input.mousePointer.position.x < gotoMenuButton.position.x + gotoMenuButton.texture.width / 2
              && game.input.mousePointer.position.y > gotoMenuButton.position.y - gotoMenuButton.texture.height / 2
              && game.input.mousePointer.position.y < gotoMenuButton.position.y + gotoMenuButton.texture.height / 2)
              { game.state.start('mainMenu'); game.paused = false; }
          }
        };
    },

    resumedMenu: function (music, gInputs, game) {
        music.resume();
        game.stage.disableVisibilityChange = false;
        gInputs.pMenu.ff = false;

        pausePanel.destroy();
        unpauseButton.destroy();
        gotoMenuButton.destroy();
    },

    offPauseMenuControl: function (game, gInputs) {
        if (gInputs.pMenu.button.isDown && !gInputs.pMenu.ff) {
          gInputs.pMenu.ff = true;
          game.paused = true;
        }
        //MIRAR DOCUMENTACION DE PHASER.SIGNAL
        else if (gInputs.pMenu.isUp)
          gInputs.pMenu.ff = false;
        //console.log(gInputs.pMenu.ff)
    }
}

module.exports = pauseMenu;
