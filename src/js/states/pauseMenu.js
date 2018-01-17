'use strict';

var pausePanel;
var unpauseButton;
var gotoMenuButton;


var pauseMenu = {
    pausedCreate: function (music) {
        music.pause();
        this.game.stage.disableVisibilityChange = true;
        this.game.input.onDown.add(unPause, this);
    
        
        pausePanel = this.game.add.sprite(width / 2, height / 2, 'pausePanel');
        pausePanel.anchor.setTo(0.5, 0.5);
        pausePanel.alpha = 0.5;
        
        unpauseButton = this.game.add.sprite(width / 2, height / 2 - 50, 'resume');
        unpauseButton.anchor.setTo(0.5, 0.5);
        unpauseButton.scale.setTo(0.75, 0.75);
    
        gotoMenuButton = this.game.add.sprite(width / 2, height / 2 + 50, 'quitToMenu');
        gotoMenuButton.anchor.setTo(0.5, 0.5);
        gotoMenuButton.scale.setTo(0.75, 0.75);    
    
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

    resumedMenu: function (music, gInputs) {
        music.resume();
        this.game.stage.disableVisibilityChange = false;
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