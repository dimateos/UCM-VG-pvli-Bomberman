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
};

module.exports = config;
