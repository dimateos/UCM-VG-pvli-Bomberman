'use strict';

//returns the inputs for player 0-3
//sort of data storage/factory (it needs game's reference)

const debugPosX = 40;
const debugPosY = 600 - 96;
const debugPosSeparation = 15;
const debugColor = "yellow";

var debugCallback;

function Inputs(game, numPlayer) {

    if (numPlayer === -1) this.globalControls(game);
    else {

        //needed to be created first (atm it creates this.bomb)
        this.bomb = {ff: false}; //bomb flip flop (not really a control)

        this.switchControls(game, numPlayer);

    }
};

//all global inputs
Inputs.prototype.globalControls = function(game) {
    this.pMenu = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        ff: false
    }
    this.addPlayer = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.X),
        ff: false
    }
    this.debug = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.C),
        ff: false,
        state: false
    }
    this.resetLevel = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.B),
        ff: false,
    },
    this.nextLevel = {
        button: game.input.keyboard.addKey(Phaser.Keyboard.N),
        ff: false,
    }
}

//selects specific controls
Inputs.prototype.switchControls = function (game, numPlayer) {
    switch (numPlayer) {
        case 0:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.E)

            this.drawDebug(game, numPlayer);
            break;

        case 1:
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)

            this.drawDebug(game, numPlayer);
            break;

        case 2:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.T),
                down: game.input.keyboard.addKey(Phaser.Keyboard.G),
                left: game.input.keyboard.addKey(Phaser.Keyboard.F),
                right: game.input.keyboard.addKey(Phaser.Keyboard.H),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.Y)

            this.drawDebug(game, numPlayer);
            break;

        case 3:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.O)

            this.drawDebug(game, numPlayer);
            break;
    }
}

//writes the controls for a specific player
var stringsControls = ["WASD + E","ARROWS + Numpad_1","TFGH + Y","IJKL + O"]
Inputs.prototype.drawDebug = function(game, numPlayer) {

    if (debugCallback !== undefined) game.time.events.remove(debugCallback);

    game.debug.text(" - Controls P" +numPlayer+ ": " +stringsControls[numPlayer],
        debugPosX, debugPosY + debugPosSeparation * numPlayer, debugColor);

    // console.log(" - Controls P"+numPlayer+": " +stringsControls[numPlayer]);
    debugCallback = game.time.events.add(5000, function reset () {this.debug.reset();}, game);
}

module.exports = Inputs;
