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

        this.game.load.image('enemy_0', 'images/Sprites/Creep/Creep_0.png');
        this.game.load.image('enemy_1', 'images/Sprites/Creep/Creep_1.png');
        this.game.load.image('enemy_2', 'images/Sprites/Creep/Creep_2.png');

        //Main Menu sprites
        this.game.load.image('mMenuBG', 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image('mMenuButton1', 'images/Sprites/Menu/PVE_mode.png');
        this.game.load.image('mMenuButton2', 'images/Sprites/Menu/PVP_mode.png');
        this.game.load.image('mMenuTitle', 'images/Sprites/Menu/title.png');

        this.game.load.image('pausePanel', 'images/Sprites/Menu/White_Panel.png');
        this.game.load.image('quitToMenu', 'images/Sprites/Menu/QuitToMenu.png');
        this.game.load.image('resume', 'images/Sprites/Menu/Resume.png');

        this.game.load.image('unmuted', 'images/Sprites/Menu/unMuted.png');
        this.game.load.image('muted', 'images/Sprites/Menu/Muted.png');        

        //HUD sprites
        this.game.load.image('HUDBg', 'images/Sprites/HUD/HUDBg.png');
        this.game.load.image('HUDPoints', 'images/Sprites/HUD/HUDPoints.png');
        this.game.load.image('HUD2', 'images/Sprites/HUD/HUD2.png');
        
        
        //Music and audio
        this.game.load.audio('music', 'audio/music.ogg');
        this.game.load.audio('xplosion', 'audio/explosion.ogg');
        this.game.load.audio('powerup', 'audio/powerup.ogg');
        this.game.load.audio('portal', 'audio/portal.ogg');

    },

    create: function () {
        this.game.state.start('mainMenu');
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;
