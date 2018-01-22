'use strict';

var baseMapData = {

    //required as the map is a [[]] and we need to splice each []
    copyMap: function (map) {
        var copiedMap = [];

        for (var i = 0; i < map.length; i++)
            copiedMap.push(map[i].slice());

        return copiedMap;
    },

    cols: 15, fils: 13, //not really necessary

    playerSpawns:
    [
        { x: 1, y: 1 }, //(squares[1][1])
        { x: 13, y: 1 },
        { x: 1, y: 11 },
        { x: 13, y: 11 },
    ],

    squaresTypes:
    {
        wall: { value: 1, sprite: "wall" },
        wallSP: { value: 2, sprite: "wallSP" },

        free: { value: 0, sprite: "background" },

        bombable: { value: 3, sprite: "bombable" },
        bombableDrop: { value: 4, sprite: "bombableDrop" },

        enemy: { value: 5, sprite: null }, //defined at their factories
        enemyDrop: { value: 6, sprite: null },

        bomb: { value: 7, sprite: null },
    },

    squares: //all values at squaresTypes ^
    [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],

    rndGeneration: function (game, level) {

        const tutorialEnemies = 3;
        const tutorialDrops = 1;
        const baseEnemies = 4;

        const diffTiers = 3;

        const maxMinEnemies = 8;
        const minDrops = 2;
        const maxDrops = 3; //only when maxMinEnemies

        //between and including min and max (Phaser)
        var extraWalls = game.rnd.integerInRange(6, 8);
        var bombables = game.rnd.integerInRange(33, 36);
        var powerUps = [1, 2, 2];
        var theme = "basic";

        var enemies, enemiesDrops = [], structedEnemies = [];

        if (level === 0) {
            structedEnemies.push(tutorialEnemies);
            enemiesDrops.push(tutorialDrops);
        }
        else {
            var minEnemies = baseEnemies + level;
            if (minEnemies > maxMinEnemies) minEnemies = maxMinEnemies;

            enemies = game.rnd.integerInRange(minEnemies, minEnemies + 1);

            if (minEnemies === maxMinEnemies)
                enemiesDrops.push(game.rnd.integerInRange(minDrops, maxDrops));
            else enemiesDrops.push(minDrops);

            var structedEnemies = [];
            var max = diffTiers;
            if (level === 1) max--;
            for (var i = 0; i < max; i++) {
                if (i === max-1) n = enemies;
                else var n = game.rnd.integerInRange(0, enemies);
                structedEnemies.push(n);
                enemies -= n;
            }
        }


        return {
            extraWalls: extraWalls,
            bombables: bombables,
            powerUps: powerUps,
            enemies: structedEnemies,
            enemiesDrops: enemiesDrops,
            theme: theme,
        }
    }

};

module.exports = baseMapData;
