'use strict';

var player;
var wall;
var box;
var bomb;
var background;

var cursors;
var bombButton;
var onceButton = false;

var toggleBoxCollisionButton; //just for debugging and milestone 1 pitch
var isBoxCollDisabled = false;
var onceButtonDebug = false;

const width = 800;
const height = 600;

var PlayScene = {
  preload: function () {
    this.game.stage.backgroundColor = '#E80C94';
    this.startTime = Date.now(); //to calculate booting time
  },

  isOdd:function (num) { return (num % 2) == 1;},
  
  create: function () {
    
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    player = this.game.add.sprite(
      80, 40, 'player');
    player.scale.setTo(1/1.2, 1/1.6);
    
    background = this.game.add.group();
    background.scale.setTo(1/1.2, 1/1.6);

    wall = this.game.add.physicsGroup();

    box = this.game.add.physicsGroup();

    bomb = this.game.add.physicsGroup();
    bomb.scale.setTo(1/1.2, 1/1.6);


    for (let i = - 25; i < width + 25; i += 50) {
      for (let j = 0; j < height ; j += 40) {
        background.create(i * 1.2, j * 1.6, 'background');
      }
    }

    for (let i = 25; i < width-25; i += 50) {
      for (let j = 0; j < height; j += 40) {
        if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
          wall.create(i, j,'wall');
        }
        if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
      || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))  
        {
          box.create(i, j,'box');
        }
        
      }
    }
    for (let i = 0; i < wall.length; i++) {
      wall.children[i].scale.setTo(1/1.2, 1/1.6);
    }
    for (let i = 0; i < box.length; i++) {
      box.children[i].scale.setTo(1/1.2, 1/1.6);
    }

    wall.setAll('body.immovable', true);
    box.setAll('body.immovable', true);

    this.game.physics.arcade.enable(player);
    player.body.setSize(50, 60, -1, 28);
    player.body.collideWorldBounds = true;

    cursors = this.game.input.keyboard.createCursorKeys();
    
    console.log(player);
    console.log(player.body.height);

    //  logo.anchor.setTo(0.5, 0.5);
    //  logo.scale.setTo(1.25,1.25); // to fit in the canvas

    bombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    toggleBoxCollisionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
     
    console.log(this);
    console.log("Loaded...", Date.now()-this.startTime, "ms");
  },

  destBomb: function () { bomb.remove(bomb.children[0], true); },  

  update: function(){
    this.game.physics.arcade.collide(player, wall);
    this.game.physics.arcade.collide(player, box);
    this.game.world.bringToTop(player);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
    }
    if (cursors.up.isDown){
    player.body.velocity.y = -250;
    }
    else if (cursors.down.isDown){
      player.body.velocity.y = 250;
    }
    if(bombButton.isDown && !onceButton){
      bomb.create(player.centerX*1.2-24,player.centerY*1.6-12,'bomb');
      this.game.time.events.add(3000, this.destBomb, this);
      onceButton = true;
    } 
    else if(!bombButton.isDown && onceButton)
      onceButton = false;

    if(toggleBoxCollisionButton.isDown && !onceButtonDebug) //JUST FOR DEBUGGING AND MILESTONE 1 PITCH
      {        
        if (!isBoxCollDisabled) {
          for (let i = 0; i < box.length; i++) {
            box.children[i].body.checkCollision.up = false;
            box.children[i].body.checkCollision.down = false;
            box.children[i].body.checkCollision.left = false;
            box.children[i].body.checkCollision.right = false;
          }
          isBoxCollDisabled = true;
        }

        else
          {
            for (let i = 0; i < box.length; i++) {
              box.children[i].body.checkCollision.up = true;
              box.children[i].body.checkCollision.down = true;
              box.children[i].body.checkCollision.left = true;
              box.children[i].body.checkCollision.right = true;
            }
            isBoxCollDisabled = false;
          }
        
        onceButtonDebug = true;
      }
    else if(!toggleBoxCollisionButton.isDown && onceButtonDebug)
      onceButtonDebug = false;

  },

  //DEBUG TOOLS
  // render: function(){
  //   //this.game.debug.bodyInfo(player, 32, 32);
  //   this.game.debug.body(player);
  //   //this.game.debug.body(box.children[5]);
  //   for (let i = 0; i < wall.length; i++) {
  //       this.game.debug.body(wall.children[i]);      
  //   }
  // }

};


module.exports = PlayScene;
