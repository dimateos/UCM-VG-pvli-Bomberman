'use strict';
const config = require('../config.js');

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

const pausePanelPos = config.pausePanelPos;
const pausePanelAnchor = config.pausePanelAnchor;
const pausePanelAlpha = config.pausePanelAlpha;

const unpauseButtonPos = config.unpauseButtonPos;
const unpauseButtonAnchor = config.unpauseButtonAnchor;
const unpauseButtonScale = config.unpauseButtonScale;

const gotoMenuButtonPos = config.gotoMenuButtonPos;
const gotoMenuButtonAnchor = config.gotoMenuButtonAnchor;
const gotoMenuButtonScale = config.gotoMenuButtonScale;

var pausePanel;
var unpauseButton;
var gotoMenuButton;

var pauseMenu = {
    pausedCreate: function (music, game) {
        music.pause();
        game.stage.disableVisibilityChange = true;
        game.input.onDown.add(unPause, this);

        pausePanel = game.add.sprite(pausePanelPos.x, pausePanelPos.y, 'pausePanel');
        pausePanel.anchor.setTo(0.5, 0.5);
        pausePanel.alpha = 0.5;

        unpauseButton = game.add.sprite(pausePanelPos.x, pausePanelPos.y - 50, 'resume');
        unpauseButton.anchor.setTo(0.5, 0.5);
        unpauseButton.scale.setTo(0.75, 0.75);

        gotoMenuButton = game.add.sprite(pausePanelPos.x, pausePanelPos.y + 50, 'quitToMenu');
        gotoMenuButton.anchor.setTo(0.5, 0.5);
        gotoMenuButton.scale.setTo(0.75, 0.75);

        function unPause() {
          if (game.paused) {
            if (checkBorders(game.input, unpauseButton)) game.paused = false;

            else if (checkBorders(game.input, gotoMenuButton)) {
              game.state.start('mainMenu');
              game.paused = false;
            }
          }
        };

        function checkBorders(inputPointer, button) {
          return (inputPointer.position.x > button.position.x - button.texture.width / 2
          && inputPointer.position.x < button.position.x + button.texture.width / 2
          && inputPointer.position.y > button.position.y - button.texture.height / 2
          && inputPointer.position.y < button.position.y + button.texture.height / 2)
        }
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
