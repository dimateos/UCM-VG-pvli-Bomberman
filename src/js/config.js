'use strict';

const Point = require('./general/point.js');
const keys = require('./keys.js');

const width = 800;
const height = 600;

const config = {

    keys: keys,

    DEBUG: true,
    winWidth: width,
    winHeight: height,

    debugPos: new Point(32, height - 96),
    debugColor: "yellow",

    tileData: {
        Res: new Point(64, 64),
        Scale: new Point(0.75, 0.625), //64x64 to 48x40
        Offset: new Point(40, 80), //space for hud
    },

    initialMapPveDEBUG: { world: 0, level: 0 },
    initialMapPve: { world: 1, level: 1 },
    initialMapPvP: { world: 1, level: 0 },


    //PvE
    pve_initialPlayers: 2,
    pve_maxPlayers: 2, //needed for the map generation


    //PvE
    pvp_initialPlayers: 4,
    pvp_maxPlayers: 4,


    //MAP

    debugMapPos: new Point(40, 504),
    debugColor: "yellow",
    defaultBodyOffset: new Point(),
    defaultImmovable: true,
    defaultBombableLives: 1,
    defaultBombableInvencibleTime: 0,
    deathZoneTimeStart: 2*60*1000,
    deathZoneTimeLoop: 5*1000,


    //PLAYER

    //  playerBodySize: new Point(48, 48), //little smaller
    //  playerBodyOffset: new Point(0, 40),
    playerBodySize: new Point(40, 32), //little smaller
    playerBodyOffset: new Point(6, 48),
    playerExtraOffset: new Point(6, -20), //reaquired because player body is not full res

    playerImmovable: false,

    playerLives: 1,
    playerExtraLifePoints: 1000,
    playerNumBombs: 1,

    playerInvencibleTime: 5000,
    playerRespawnedStoppedTime: 1000,
    playerDeathTime: 1500,
    playerLifeTime: 60 * 3 * 1000,

    step: Math.PI * 2 / 360, //degrees
    playerInitialAlphaAngle: 30, //sin(playerInitialAlphaAnlge) -> alpha
    alphaWavingSpeed: 1.75,
    hudAnimSpeed: 1 / 18, //1/18 is the correct

    playerVelocity: 140, //max=playerVelocity+5*10 (depends on powerUps)
    playerVelocityTurning: 105, //140 105


    //BOMB

    bombBodySize: new Point(48, 48), //little smaller
    bombBodyOffset: new Point(0, 0),
    bombExtraOffset: new Point(5, 5), //reaquired because bomb body is not full res

    bombImmovable: true,
    bombInvecibleTime: 0,

    bombLives: 1,
    bombPower: 1,
    bombTimer: 2000,
    bombFlameTimer: 500,


    //ENEMY

    enemyExtraOffset: new Point(0, 0),
    enemyImmovable: false,
    enemyInvecibleTime: 2500, //maybe reduce
    bombableTimer: 500,


    //PORTAL

    defaultEnemyType: 0,
    portalImmovable: true,
    portalInvencible: true,
    portalDropId: undefined,
    portalSpinVel: 0.05,
    portalBombTimer: 500,
    portalSpawnTimer: 1500,
    portalAnchor: new Point(0.5, 0.5),


    //PLAYERINFO HUD

    HUDbombHeadPos: new Point(60, 10),
    HUDbombHeadScale: new Point(0.75, 0.70),
    HUD2Pos: new Point(35, -5),
    HUD2Scale: new Point(0.75, 0.75),
    HUDlivesPos: new Point(42, 15),
    HUDlivesScale: new Point(0.2, 0),
    HUDPointsNumberPos: new Point(170, 8),
    HUDPointsNumberScale: new Point(0.2, 0),
    HUDPressXPos: new Point(90, -10),
    HUDPressXScale: new Point(0.75, 0.75),
    HUDBombPos: new Point(0, 10),
    HUDBombAnchor: new Point(0.5, 0),
    HUDBombScale: new Point(1.2, 1.2),

    
    //GAME OVER

    gmOverSignAnchor: new Point(0.5, 0.5),
    goToMenuAnchor: new Point(1, 1), 


    //AUDIO HUD

    muteMusicButtonPos: new Point(10, 40),
    muteMusicButtonScale: new Point(0.1, 0.1),
    mutedMusicButtonPos: new Point(10, 40),
    mutedMusicButtonScale: new Point(0.1, 0.1),
    lessVolButtonPos: new Point(10, 10),
    lessVolButtonScale: new Point(0.04, 0.04),
    moreVolButtonPos: new Point(30, 10),
    moreVolButtonAnchor: new Point(1, 1),
    moreVolButtonScale: new Point(0.04, 0.04),
    moreVolButtonAngle: 180,


    //PAUSE MENU

    pausePanelAnchor: new Point(0.5, 0.5),
    pausePanelAlpha: 0.5,
    unpauseButtonPos: new Point(0, 50),
    unpauseButtonAnchor: new Point(0.5, 0.5),
    unpauseButtonScale: new Point(0.75, 0.75),
    gotoMenuButtonPos: new Point(0, 50),
    gotoMenuButtonAnchor: new Point(0.5, 0.5), 
    gotoMenuButtonScale: new Point(0.75, 0.75),
};

module.exports = config;
