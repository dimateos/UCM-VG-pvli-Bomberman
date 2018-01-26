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

var pauseMenu = {

  //Works as a Pause method (a one tick method). Creates the needed objects for the pause menu and pauses music.
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
