'use strict';
var DEBUG = true;

const winWith = 800;
const winHeight = 600;

var PreloaderScene = {
    preload: function () {
        if (DEBUG) this.startTime = Date.now();

        //this.game.stage.backgroundColor = '#E80C94';
        this.loadingBar = this.game.add.sprite(winWith/2, winHeight/2, 'preloader_logo');
        this.loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        // TODO: load here the assets for the game
        //this.game.load.image('logo', 'images/readme/arena.png');

        for (var numPlayers = 0; numPlayers < 4; numPlayers++)
            this.game.load.image('player_'+numPlayers, 'images/Sprites/Bomberman/Bman_'+numPlayers+'.png');

        this.game.load.image('background', 'images/Sprites/Blocks/BackgroundTile.png');
        this.game.load.image('bombable', 'images/Sprites/Blocks/ExplodableBlock.png');
        this.game.load.image('wall', 'images/Sprites/Blocks/SolidBlock.png');
        this.game.load.image('portal', 'images/Sprites/Blocks/Portal.png');

        this.game.load.image('powerUpBombUp', 'images/Sprites/Powerups/BombPowerup.png');
        this.game.load.image('powerUpFlameUp', 'images/Sprites/Powerups/FlamePowerup.png');
        this.game.load.image('powerUpSpeedUp', 'images/Sprites/Powerups/SpeedPowerup.png');

        this.game.load.image('bomb', 'images/Sprites/Bomb/Bomb_f01.png');
        this.game.load.image('flame', 'images/Sprites/Flame/Flame_f00.png');
        this.game.load.image('enemy', 'images/Sprites/Creep/Creep_F_f00.png');

        //Main Menu sprites
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image('mMenuButton1', 'images/Sprites/Menu/One_Player_Normal.png');
        this.game.load.image('mMenuButton2', 'images/Sprites/Menu/One_Player_Hover.png');
        this.game.load.image('mMenuTitle', 'images/Sprites/Menu/title.png');

        this.game.load.image('pausePanel', 'images/Sprites/Menu/White_Panel.png');
    },

    create: function () {
        this.game.state.start('mainMenu');
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;
