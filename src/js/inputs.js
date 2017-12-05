'use strict';

//returns the inputs for player 0-3
//can be mixed/changed, repeat menu controls?
//sort of data storage/factory (it needs game's reference)

function Inputs(game, numPlayer) {

    //done apart to be able to see the common controls first
    this.switchControls(game, numPlayer);

    this.bomb.ff = false; //bomb flip flop (not really a control)
};

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
            this.bomb = {
                button: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            }
            break;

        case 1:
            this.mov = game.input.keyboard.createCursorKeys();

            this.bomb = {
                button: this.game.input.keyboard.addKey(Phaser.Keyboard.P),
            }
            break;

        case 2:
            this.mov = {
                up: {},
                down: {},
                left: {},
                rigth: {}
            },
            this.bomb = {
                button: {},
            }
            break;

        case 3:
            this.mov = {
                up: {},
                down: {},
                left: {},
                rigth: {}
            },
            this.bomb = {
                button: {},
            }
            break;
    }
}

module.exports = Inputs;
