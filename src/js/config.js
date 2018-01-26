'use strict';

const keys = require('./keys.js');
const Point = require('./general/point.js');

const width = 800;
const height = 600;

const config = {

    keys: keys,

    HACKS: false, //extra controls (rebuild level, next level, show bodys)

    endless_rnd_map_gen: true,

    default_muted: false,
    default_volume: 0.25,

    DEBUG: false,
    debugPos: new Point(32, height - 96),
    debugColor: "yellow",

    winWidth: width,
    winHeight: height,

    tileData: {
        Res: new Point(64, 64),
        Scale: new Point(0.75, 0.625), //64x64 to 48x40
        Offset: new Point(40, 80), //space for hud
    },


    //PvE
    initialMapPveDEBUG: { world: 0, level: 0 },
    initialMapPve: { world: 1, level: 1 },
    pve_initialPlayers: 1,
    pve_maxPlayers: 2, //needed for the map generation

    playerLifeTime: 2.5 * 60 * 1000,
    hudAnimSpeed: 10 / (2.5 * 60), //animation lasts 3 min

    //PvP
    initialMapPvP: { world: 1, level: 0 },
    pvp_initialPlayers: 2,
    pvp_maxPlayers: 4,

    deathZoneTimeStart: 1.5 * 60 * 1000, //sync with hud anim
    deathZoneTimeLoop: 2.5 * 1000,
    hudAnimSpeedPvp: 10 / (2 * 60), //animation lasts 2 min

    //MAP

    debugMapPos: new Point(40, 504),
    defaultBodyOffset: new Point(),
    defaultImmovable: true,
    defaultBombableLives: 1,
    defaultBombableInvencibleTime: 0,


    //PLAYER

    //doesnt affect to the controls, it's used for the debug ingame
    stringsControls: ["WASD + E","ARROWS + Numpad_1","TFGH + Y","IJKL + O"],

    playerBodySize: new Point(40, 32), //little smaller
    playerBodyOffset: new Point(6, 48),
    playerExtraOffset: new Point(6, -20), //reaquired because player body is not full res

    playerImmovable: false,

    playerLives: 3,
    playerExtraLifePoints: 3000,
    playerNumBombs: 1,

    playerInvencibleTime: 5000,
    playerRespawnedStoppedTime: 1000,
    playerDeathTime: 1500,

    playerVelocity: 140, //max=playerVelocity+5*10 (depends on powerUps)
    playerVelocityTurning: 105, //140 105


    //BOMBABLE

    bombableTimer: 500,
    step: Math.PI * 2 / 360, //degrees
    playerInitialAlphaAngle: 30, //sin(playerInitialAlphaAnlge) -> alpha
    alphaWavingSpeed: 1.75,


    //IDENTIFIABLE

    idBodySize: new Point(32, 32),
    idBodyOffset: new Point(0, 0),
    idExtraOffset: new Point(14, 10),
    idImmovable: true,


    //POWEUPS

    bombsKey: "numBombs",
    bombsAdd: 1,
    bombsMin: 1,
    bombsMax: 10,

    flameKey: "power",
    flameAdd: 1,
    flameMax: 10, //no flame min needed

    speedKey: "velocity",
    speedAdd: 25,
    speedMin: 200,
    speedLimit: 200 + 25 * 8,


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


    //FLAMES

    flameBodySize: new Point(48, 48),
    flameBodyOffset: new Point(0, 0),
    flameExtraOffset: new Point(5, 5),
    flameImmovable: true,


    //ENEMY

    enemyBasicVelocity: 90,
    enemyExtraOffset: new Point(0, 0),
    enemyImmovable: false,
    enemyInvecibleTime: 2500, //maybe reduce


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
    HUDPressXPos: new Point(90, -10),
    HUDPressXScale: new Point(0.75, 0.75),

    HUD2Pos: new Point(35, -5),
    HUD2Scale: new Point(0.75, 0.75),
    HUDlivesPos: new Point(42, 15),
    HUDlivesScale: new Point(0.2, 0),

    HUDPointsNumberPos: new Point(170, 8),
    HUDPointsNumberScale: new Point(0.2, 0),

    HUDBombPos: new Point(0, 17),
    HUDBombAnchor: new Point(0.5, 0),
    HUDBombScale: new Point(1.2, 1.2),

    HUDFlameOffset: new Point(0, -16),
    HUDFlameScale: new Point(1.5, 1.5),

    HUDBombPosText: new Point(-8, 8),
    HUDBombPosOffset: new Point(-5,0),

    //GAME OVER

    gmOverSignAnchor: new Point(0.5, 0.5),
    goToMenuAnchor: new Point(1, 1),

    pvpOverPos: new Point(width/2, height/2+40),
    pvpOverAnchor: new Point(0.5, 0.5),
    pvpOverScale: new Point(1, 1),
    pvpOverPlayerOffset: new Point(-115, 20),
    pvpOverPlayerScale: new Point(1.7, 1.7),

    pvpOverText0Offset: new Point(-180, -140),
    pvpOverText1Offset: new Point(-20, -70),
    pvpOverText2Offset: new Point(-20, -10),
    pvpOverText3Offset: new Point(-20, 50),

    //AUDIO HUD

    volume_increment: 0.10,
    volume_Max: 1,
    volume_Min: 0.10,

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

    pausePanelPos: new Point(width/2, height/2+40),
    pausePanelAnchor: new Point(0.5, 0.5),
    pausePanelAlpha: 0.5,
    unpauseButtonPos: new Point(0, -50),
    unpauseButtonAnchor: new Point(0.5, 0.5),
    unpauseButtonScale: new Point(0.75, 0.75),
    gotoMenuButtonPos: new Point(0, 50),
    gotoMenuButtonAnchor: new Point(0.5, 0.5),
    gotoMenuButtonScale: new Point(0.75, 0.75),


    //MAIN MENU

    buttonCount: 1,
    initWinsNecessary: 1,
    minWinsNec: 1,
    maxWinsNec: 9,
    mMenuBGPos: new Point(0, 0),
    mMenuBGScale: new Point(1, 1.05),
    mMenuPVEPos: new Point(0, 90),
    mMenuPVEScale: new Point(0.7, 0.7),
    mMenuPVEAnchor: new Point(0.5, 0.5),
    mMenuPVPPos: new Point(0, 160),
    mMenuPVPScale: new Point(0.7, 0.7),
    mMenuPVPAnchor: new Point(0.5, 0.5),
    mMenuTitlePos: new Point(50, -175),
    numbers: { pos: new Point(260, 0), scale: new Point(0.5, 0.5), anchor: new Point(0.4, 0.4) },
    doneButton: { pos: new Point(0, 50), scale: new Point(0.5, 0.5), anchor: new Point(0.5, 0.5) },
    howManyWins: { pos: new Point(0, -50), scale: new Point(0.3, 0.3), anchor: new Point(0.5, 0.5) },


    //INPUTS

    debugPos: new Point(40, 504),
    debugPosSeparation: 15,
};

module.exports = config;
