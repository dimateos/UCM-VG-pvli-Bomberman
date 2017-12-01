(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
const DEBUG = true;

const winWith = 800;
const winHeight = 600;

var BootScene = {

  preload: function () {
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time etc

    // load here assets required for the loading screen
    this.game.load.image('preloader_logo', 'images/phaser.png');
    // TODO: image not centered, almost off the canvas I think
  },

  create: function () {

    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.pageAlignHorizontally = true;
    //this.scale.setScreenSize();

    this.game.state.start('preloader');
    if (DEBUG) console.log("Booting...", Date.now()-this.startTime, "ms");
  }
};


var PreloaderScene = {
  preload: function () {
    if (DEBUG) this.startTime = Date.now();

    //this.game.stage.backgroundColor = '#E80C94';
    this.loadingBar = this.game.add.sprite(winWith/2, winHeight/2, 'preloader_logo');
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    //this.game.load.image('logo', 'images/readme/arena.png');

    this.game.load.image('player', 'images/Sprites/Bomberman/Front/Bman_F_f00Correct.png');

    this.game.load.image('wall', 'images/Sprites/Blocks/SolidBlock.png');

    this.game.load.image('box', 'images/Sprites/Blocks/ExplodableBlock.png');

    this.game.load.image('bomb', 'images/Sprites/Bomb/Bomb_f01.png');

    this.game.load.image('background', 'images/Sprites/Blocks/BackgroundTile.png');
  },

  create: function () {
    this.game.state.start('play');
    if (DEBUG) console.log("Preloading...", Date.now()-this.startTime, "ms");
  }
};

var PlayScene = require('./play_scene.js');

window.onload = function () {
  var game = new Phaser.Game(winWith, winHeight, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

},{"./play_scene.js":9}],2:[function(require,module,exports){
'use strict';

var  Bombable = require('./bombable.js');

function Bomb (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, timer, power, bombGroup) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    game.time.events.add(timer, this.xplode, this);

    this.timer = timer;
    this.power = power;

    this.bombGroup = bombGroup;

};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.xplode = function() {
    this.bombGroup.remove(this, true); //removes and destroy
    //this.destroy();
}

module.exports = Bomb;

},{"./bombable.js":3}],3:[function(require,module,exports){
'use strict';

var Physical = require('./physical.js');

function Bombable(game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.lives = lives;
    this.invencible = invencible;

}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;

module.exports = Bombable;

},{"./physical.js":6}],4:[function(require,module,exports){
'use strict';

function GameObject (game, position, sprite, scale) {

    Phaser.Sprite.call(this, game, position.x, position.y, sprite);

    game.add.existing(this);
    this.scale.setTo(scale.x, scale.y);

};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;

},{}],5:[function(require,module,exports){
'use strict';

function Identifiable(id, timer) {
    this.id = id;
    this.timer = timer;

    //deactivate its collisions
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
  }

Identifiable.prototype.countDown = function() {};

module.exports = Identifiable;

},{}],6:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

function Physical(game, position, sprite, scale, bodySize, bodyOffSet, immovable) {

    GameObject.call(this, game, position, sprite, scale);

    game.physics.arcade.enable(this);
    this.body.setSize(bodySize.x, bodySize.y, bodyOffSet.x, bodyOffSet.y);
    this.body.collideWorldBounds = true;

    this.body.immovable = immovable; //if static then immovable

    //vel y dir?

}

Physical.prototype = Object.create(GameObject.prototype);
Physical.prototype.constructor = Physical;

module.exports = Physical;

},{"./gameObject.js":4}],7:[function(require,module,exports){
'use strict';

var  Bombable = require('./bombable.js');
var Bomb = require('./bomb.js')

function Player (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, input, bombButton, bombButtonFF, bombs, bombGroup, mods) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    this.bombs = bombs;
    this.mods = mods;
    this.input = input;

    this.bombButtonFF = bombButtonFF;
    this.bombButton = bombButton;
    this.bombGroup = bombGroup;
};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    //MOVEMENT
    if (this.input.left.isDown) {
      this.body.velocity.x = -250;
    }
    else if (this.input.right.isDown) {
        this.body.velocity.x = 250;
    }
    if (this.input.up.isDown) {
        this.body.velocity.y = -250;
    }
    else if (this.input.down.isDown){
        this.body.velocity.y = 250;
    }

    //BOMB
    if(this.bombButton.isDown && !this.bombButtonFF){
        this.bombGroup.add(new Bomb (this.game, {x: this.position.x, y: this.position.y+22},
            'bomb', this.scale, {x: 64, y: 64}, {x: 0, y: 0}, true, 1, false, 3000, 1, this.bombGroup));

        this.bombButtonFF = true;
    }
    else if(this.bombButton.isUp) //deploy 1 bomb each time
        this.bombButtonFF = false;

}

module.exports = Player;

},{"./bomb.js":2,"./bombable.js":3}],8:[function(require,module,exports){
'use strict';

function Point(x, y) {
    this.x = x;
    this.y = y;
  }

module.exports = Point;

},{}],9:[function(require,module,exports){
'use strict';
const DEBUG = true;

var Point = require('./objects/point.js');

var GameObject = require('./objects/gameObject.js')
var Physical = require('./objects/physical.js');
var Bombable = require('./objects/bombable.js');

var Identifiable = require('./objects/identifiable.js');

var Player = require('./objects/player.js');
var Bomb = require('./objects/bomb.js');

var player, player2;

var wallGroup; //groups
var boxGroups;
var bombGroup;
var background;

var cursors;
var wasd;
var bombButton;
var bombButton2;
var bombButtonFF = false;
var bombButton2FF = false;

var toggleBoxCollisionButton; //just for debugging
var isBoxCollDisabled = false;
var toogleBoxCollisionButtonFF = false; //flip flop

const width = 800;
const height = 600;

var PlayScene = {

  isOdd:function (num) { return (num % 2) == 1;},
  //destBomb: function () { bomb.remove(bomb.children[0], true); },

  preload: function () {
    //this.game.stage.backgroundColor = '#E80C94';
    if (DEBUG) this.startTime = Date.now(); //to calculate booting time
  },

  create: function () {

    //Controls
    cursors = this.game.input.keyboard.createCursorKeys();

    wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    bombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    bombButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

    toggleBoxCollisionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C); //debug

    //groups for tiles
    background = this.game.add.group();
    background.scale.setTo(1/1.2, 1/1.6);

    wallGroup = this.game.add.group();
    boxGroups = this.game.add.group();
    bombGroup = this.game.add.group();
    console.log(bombGroup);

    //player
    player = new Player(this.game, new Point(80, 40), 'player', new Point(1/1.2, 1/1.6),
    new Point(50, 60), new Point(-1, 28), false, 3, false, wasd, bombButton, bombButtonFF, 1, bombGroup,{});

    player2 = new Player(this.game, new Point(680, 520), 'player', new Point(1/1.2, 1/1.6),
    new Point(50, 60), new Point(-1, 28), false, 3, false, cursors, bombButton2, bombButton2FF, 1, bombGroup,{});

    //instead of a map.dat now we just insert them
    for (let i = - 25; i < width + 25; i += 50)
      for (let j = 0; j < height ; j += 40)
        background.add(new GameObject(this.game,
          new Point(i * 1.2, j * 1.6), 'background', new Point(1, 1)));

    for (let i = 25; i < width-25; i += 50) {
      for (let j = 0; j < height; j += 40) {
        if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
          //wall.create(i, j,'wall');
          wallGroup.add(new Physical(this.game,
             new Point(i, j), 'wall', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true));
        }
        if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
      || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))
        {
          boxGroups.add(new Bombable(this.game,
             new Point(i, j), 'box', new Point(1/1.2, 1/1.6), new Point(64,64), new Point(0,0), true, 1, false));
        }
      }
    }

    if (DEBUG) console.log("Loaded...", Date.now()-this.startTime, "ms");
    if (DEBUG) console.log("\n PLAYER: ", player.body);
    if (DEBUG) console.log("Player body height: ", player.body.height);
  },


  update: function(){
    this.game.physics.arcade.collide(player, wallGroup);
    this.game.physics.arcade.collide(player, boxGroups);

    this.game.physics.arcade.collide(player2, wallGroup);
    this.game.physics.arcade.collide(player2, boxGroups);

    this.game.world.bringToTop(player);
    this.game.world.bringToTop(player2);

    debugMode();

    //rest in player.update()
  },

  render: function(){
    if (isBoxCollDisabled) {
      //console.log(wall.children[5])
      this.game.debug.bodyInfo(player, 32, 32);
      this.game.debug.body(player);
      this.game.debug.body(boxGroups.children[5]);
      for (let i = 0; i < wallGroup.length; i++) {
          this.game.debug.body(wallGroup.children[i]);
      }
    }
  }

};

//shows hitboxes and allows movement through the boxes
var debugMode = function () {
  if(toggleBoxCollisionButton.isDown && !toogleBoxCollisionButtonFF)
  {
    if (!isBoxCollDisabled) {
      for (let i = 0; i < boxGroups.length; i++) {
        boxGroups.children[i].body.checkCollision.up = false;
        boxGroups.children[i].body.checkCollision.down = false;
        boxGroups.children[i].body.checkCollision.left = false;
        boxGroups.children[i].body.checkCollision.right = false;
      }
      isBoxCollDisabled = true;
    }
    else
      {
        for (let i = 0; i < boxGroups.length; i++) {
          boxGroups.children[i].body.checkCollision.up = true;
          boxGroups.children[i].body.checkCollision.down = true;
          boxGroups.children[i].body.checkCollision.left = true;
          boxGroups.children[i].body.checkCollision.right = true;
        }
        isBoxCollDisabled = false;
      }

    toogleBoxCollisionButtonFF = true;
  }
else if(!toggleBoxCollisionButton.isDown && toogleBoxCollisionButtonFF)
  toogleBoxCollisionButtonFF = false;
}

module.exports = PlayScene;

},{"./objects/bomb.js":2,"./objects/bombable.js":3,"./objects/gameObject.js":4,"./objects/identifiable.js":5,"./objects/physical.js":6,"./objects/player.js":7,"./objects/point.js":8}]},{},[1]);
