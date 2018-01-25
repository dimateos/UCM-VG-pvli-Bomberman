'use strict';
const config = require('../config.js');
const keys = config.keys;

const DEBUG = config.DEBUG;
const winWidth = config.winWidth;
const winHeight = config.winHeight;

var PreloaderScene = {
    preload: function () {
        if (DEBUG) this.startTime = Date.now();

        //this.game.stage.backgroundColor = '#E80C94';
        this.loadingBar = this.game.add.sprite(winWidth/2, winHeight/2, 'preloader_logo');
        this.loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        for (var numPlayers = 0; numPlayers < 4; numPlayers++){
            this.game.load.spritesheet(keys.player+numPlayers, 'images/Sprites/Bomberman/Bomb0'+numPlayers+'+Exploding.png', 64, 86);
            this.game.load.spritesheet(keys.player+numPlayers+'Clock', 'images/Sprites/Bomberman/Bman_'+numPlayers+'Clock.png', 47, 88)
        }

        this.game.load.image(keys.background, 'images/Sprites/Blocks/BackgroundTile.png');
        this.game.load.spritesheet(keys.bombable, 'images/Sprites/Blocks/ExplodableBlockAnim.png', 64, 64);
        this.game.load.image(keys.wall, 'images/Sprites/Blocks/SolidBlock.png');
        this.game.load.image(keys.portal, 'images/Sprites/Blocks/Portal.png');

        this.game.load.image(keys.powerUpBombUp, 'images/Sprites/Powerups/BombPowerup.png');
        this.game.load.image(keys.powerUpFlameUp, 'images/Sprites/Powerups/FlamePowerup.png');
        this.game.load.image(keys.powerUpSpeedUp, 'images/Sprites/Powerups/SpeedPowerup.png');
        this.game.load.image(keys.pointsUp, 'images/Sprites/Powerups/PointPowerup.png');
        this.game.load.image(keys.pointsUpPlus, 'images/Sprites/Powerups/PointPowerupPlus.png');

        this.game.load.spritesheet(keys.bomb, 'images/Sprites/Bomb/Bomb_f1.png', 48, 48);
        this.game.load.spritesheet(keys.flame, 'images/Sprites/Flame/flames.png', 48, 48);

        this.game.load.spritesheet(keys.enemy_0, 'images/Sprites/Creep/creep0.png', 64, 64);
        this.game.load.spritesheet(keys.enemy_1, 'images/Sprites/Creep/creep1.png', 64, 64);
        this.game.load.spritesheet(keys.enemy_2, 'images/Sprites/Creep/creep2.png', 64, 64);

        //Main Menu sprites
        this.game.load.image(keys.mMenuBG, 'images/Sprites/Menu/title_background.jpg');
        this.game.load.image(keys.mMenuButton1, 'images/Sprites/Menu/PVE_mode.png');
        this.game.load.image(keys.mMenuButton2, 'images/Sprites/Menu/PVP_mode.png');
        this.game.load.image(keys.mMenuTitle, 'images/Sprites/Menu/title.png');

        this.game.load.image(keys.pausePanel, 'images/Sprites/Menu/White_Panel.png');
        this.game.load.image(keys.quitToMenu, 'images/Sprites/Menu/QuitToMenu.png');
        this.game.load.image(keys.resume, 'images/Sprites/Menu/Resume.png');

        this.game.load.image(keys.gameOver, 'images/Sprites/HUD/GameOver.png')
        this.game.load.image(keys.gameOverPvpBg, 'images/Sprites/Menu/overPvp.png')
        this.game.load.image(keys.HUDbomb, 'images/Sprites/HUD/HudBomb.png');

        this.game.load.image(keys.unmuted, 'images/Sprites/Menu/unMuted.png');
        this.game.load.image(keys.muted, 'images/Sprites/Menu/Muted.png');
        this.game.load.image(keys.volArrow, 'images/Sprites/Menu/VolumeArrow.png');

        this.game.load.spritesheet(keys.numbers, 'images/Sprites/Menu/Numbers.png', 64, 137);
        this.game.load.image(keys.done, 'images/Sprites/Menu/Done.png');
        this.game.load.image(keys.manyWins, 'images/Sprites/Menu/HowManyWins.png');

        //HUD sprites
        this.game.load.image(keys.HUDPoints, 'images/Sprites/HUD/HUDPoints.png');
        this.game.load.image(keys.HUD2, 'images/Sprites/HUD/HUD2.png');
        this.game.load.image(keys.HUDPressX, 'images/Sprites/HUD/PressX.png');

        //Music and audio
        this.game.load.audio(keys.music, 'audio/music.ogg');
        this.game.load.audio(keys.xplosion, 'audio/explosion.ogg');
        this.game.load.audio(keys.powerup, 'audio/powerup.ogg');
        this.game.load.audio(keys.portal, 'audio/portal.ogg');
    },

    create: function () {
        this.game.state.start(keys.mainMenu);
        if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
    }
  };
  module.exports = PreloaderScene;
