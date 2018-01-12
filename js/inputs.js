'use strict';

//returns the inputs for player 0-3
//can be mixed/changed, repeat menu controls?
//sort of data storage/factory (it needs game's reference)

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
        button: game.input.keyboard.addKey(Phaser.Keyboard.P),
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

            console.log(" - Controls P"+numPlayer+": WASD + E");
            break;

        case 1:
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)

            console.log(" - Controls P"+numPlayer+": ARROWS + Numpad_1");
            break;

        case 2:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.T),
                down: game.input.keyboard.addKey(Phaser.Keyboard.G),
                left: game.input.keyboard.addKey(Phaser.Keyboard.F),
                right: game.input.keyboard.addKey(Phaser.Keyboard.H),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.Y)

            console.log(" - Controls P"+numPlayer+": TFGH + Y");
            break;

        case 3:
            this.mov = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L),
            },

            this.bomb.button = game.input.keyboard.addKey(Phaser.Keyboard.O)

            console.log(" - Controls P"+numPlayer+": IJKL + O");
            break;
    }
}

module.exports = Inputs;
