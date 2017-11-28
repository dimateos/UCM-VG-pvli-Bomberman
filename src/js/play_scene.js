'use strict';

var player;
var cursors;
var wall;
var box;
var bomb;
var bombIsUp = false;
var timer;
var total = 0;  
var bombButton;
var onceButton = false;
const width = 800;
const height = 600;

var PlayScene = {
  preload: function () {
    this.game.stage.backgroundColor = '#E80C94';
    this.startTime = Date.now(); //to calculate booting time

    timer = this.game.time.create(false);
  },

  isOdd:function (num) { return (num % 2) == 1;},
  
  create: function () {
    
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    player = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'player');
    player.scale.setTo(1/2.4, 1/6.4);

    wall = this.game.add.physicsGroup();
    wall.scale.setTo(1/1.2, 1/1.6);

    box = this.game.add.physicsGroup();
    box.scale.setTo(1/1.2, 1/1.6);

    bomb = this.game.add.physicsGroup();
    bomb.scale.setTo(1/1.2, 1/1.6);

    for (let i = 25; i < width-25; i=i+50) {
      
      for (let j = 0; j < height; j=j+40) {
        if ((i==25||j==0||i==width-75||j==height-40)||(!this.isOdd((i-25)/50) && !this.isOdd(j/40))) {
          wall.create(i*1.2,j*1.6,'wall');
        }
        if ((this.isOdd((i-25)/50) && i!=75 && i!=width-125 && !this.isOdd(j/40) && j!=0 && j!=height-40&&j!=height-80&&j!=40)
      || (!this.isOdd((i-25)/50) && i!=75 && i!=width-125 && i!=25 && i!=width-75 && this.isOdd(j/40) && j!=height-80 && j!=40))  
        {
          box.create(i*1.2,j*1.6,'box');
        }
        
      }
    }
    

    wall.setAll('body.immovable', true);

    this.game.physics.arcade.enable(player);
    cursors = this.game.input.keyboard.createCursorKeys();
    player.body.collideWorldBounds = true;
    console.log(player);

    //  logo.anchor.setTo(0.5, 0.5);
    //  logo.scale.setTo(1.25,1.25); // to fit in the canvas

    bombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
     
    console.log(this);
    console.log("Loaded...", Date.now()-this.startTime, "ms");
  },

  destBomb: function () { console.log("KABOOM"); this.bomb.destroy(); this.timer.destroy(); },  

  update: function(){
    this.game.physics.arcade.collide(player, wall);
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
      bomb.create(player.centerX*1.2-30,player.centerY*1.6-40,'bomb');
      bombIsUp = true;
      onceButton = true;
    } 
    else if(!bombButton.isDown && onceButton)
      onceButton = false;

    if(bombIsUp)
      {
        timer.loop(2000, this.destBomb, this);
        timer.start();
        bombIsUp=false;        
      }
  }

};


module.exports = PlayScene;
