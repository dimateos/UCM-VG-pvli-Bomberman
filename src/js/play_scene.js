'use strict';

var player;
var cursors;

var PlayScene = {
  preload: function () {
    //game.stage.backgroundColor = '#85b5e1';
    this.startTime = Date.now(); //to calculate booting time
  },
  
  create: function () {
    
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    player = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'player');

      this.game.physics.arcade.enable(player);
      cursors = this.game.input.keyboard.createCursorKeys();
      player.body.colliderWorldBounds = true;
      console.log(player);

     logo.anchor.setTo(0.5, 0.5);
     logo.scale.setTo(1.25,1.25); // to fit in the canvas


     
    console.log(this);
    console.log("Loaded...", Date.now()-this.startTime, "ms");
  },

  update: function(){
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
  }
};

module.exports = PlayScene;
