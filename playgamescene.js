
class playgamescene extends Phaser.Scene {
    constructor() {
        super('Play','Playy')
        this.score = 0;
        this.highscore =0;
    }
    
    
/* preload function is used for loading all the images in memory*/
preload() {
   this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('jet', 'jet.png');
    this.load.image('bomb', 'bomb.png');
    this.load.image('ammo', 'ammo.png');
    this.load.image('coin', 'coin.png')
    this.load.spritesheet('explosion', 'explosion.png', {
        frameWidth: 16,
        frameHeight: 16
    })   
    this.load.audio('gunshot','gunshot.wav')//first load  explosion sound
    this.load.audio('coinhit', 'coinhit.wav')
    this.load.audio('end', 'end.mp3')
    
}    

     create() 
    {
    this.sky = this.add.tileSprite(400, 300, config.width, config.height, 'sky'); //tilesprite is used for moving background screen
    this.jet = this.physics.add.image(400, 500, 'jet').setScale(0.15).setOrigin(0.5, 0)
    this.jet.setCollideWorldBounds(true)

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', this.shoot, this)

    this.bombs = this.physics.add.group({
        key: 'bomb',
        repeat: 3,
        setXY: {
            x: 20, y: 50, stepX: Phaser.Math.Between(10, config.width - 15), stepY: Phaser.Math.Between(15, 300)
        }
    })

    this.coins = this.physics.add.group();
    for (let i =0;i<10;i++)
    {
        let x = Phaser.Math.Between(0, config.width-15) //get random position
        let y = Phaser.Math.Between(0, 200)
        let newCoin = this.coins.create(x,y, 'coin')
    }
    this.setObjVelocity(this.bombs);
    this.setObjVelocity(this.coins);
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion'),
        frameRate: 20,
        hideOnComplete: true
    })

    this.physics.add.collider(this.jet, this.coins, this.collectCoins, null, this)
    this.physics.add.collider(this.jet, this.bombs, this.endgame, null, this) //where to stop game
    this.gunshot = this.sound.add('gunshot')//adding it 
    this.coinHit = this.sound.add('coinhit')
    this.endGameMusic = this.sound.add('end')
    this.scoreText = this.add.text(600, 21, 'Score : 0', { fontSize: 28, fill: '#ff0000' })  //score onboard and set coordinates
     this.highScoreText = this.game.add.text(600, 40, 'HS: 0', {
        fontSize: 28, fill: '#ff0000' 
    })
}

endgame(jet, bomb)
{
    this.endGameMusic.play()
    this.physics.pause()
    this.jet.setTint(0xff0000)
    this.gameOver = true;
}
 collectCoins(jet, coin) {
   this.coinHit.play()
    coin.disableBody(true, true)  // when both jet n coin come in contact with each other then it will become invisible
    this.score += 10;
        this.scoreText.setText('Score : ' + this.score);
    let x = Phaser.Math.Between(0, config.width - 15)  // this is for enabling more coins 
    coin.enableBody(true, x, 0, true, true)
    let xVel = Phaser.Math.Between(-100, 100);
    let yVel = Phaser.Math.Between(150, 200)
    coin.setVelocity(xVel, yVel)
   
}
 setObjVelocity(bombs) {
    bombs.children.iterate(function (bomb) {
        let xVel = Phaser.Math.Between(-100, 100);
        let yVel = Phaser.Math.Between(150, 200)
        bomb.setVelocity(xVel, yVel)
    })
}

 shoot() {
    this.ammo = this.physics.add.image(this.jet.x, this.jet.y, 'ammo').setScale(0.1)
   this.ammo.setRotation(-Phaser.Math.PI2 / 4);
    this.ammo.setVelocityY(-600)
    this.physics.add.collider(this.ammo, this.bombs, this.destroyBomb, null, this)
}
 /*bb()
 {
     return false;
 }*/

 destroyBomb(ammo, bomb) {
    //explosion = this.add.sprite(bomb.x, bomb.y, 'explosion');
    //explosion.play('explode')
    this.gunshot.play()// for functioning 
   // coinhit.play()
    this.explosion = this.add.sprite(bomb.x, bomb.y, 'explosion').setScale(4);
    this.explosion.play('explode')
    this.score += 8;
        this.scoreText.setText('Score : ' + this.score);
    this.explosion.setRotation(-Phaser.Math.PI2 / 4);
    bomb.disableBody(true, true)
    this.ammo.disableBody(true, true)
    let x = Phaser.Math.Between(0, config.width-15)
    let y = Phaser.Math.Between(0, 200)
    bomb.enableBody(true, x, 0, true, true)
    let xVel = Phaser.Math.Between(-100, 100)
        let yVel = Phaser.Math.Between(150,200)
        bomb.setVelocity(xVel, yVel)
        
 }

    update() {
        this.highScoreText.text = 'HS: ' + localStorage.getItem("highscore");
  {
     if (this.score > localStorage.getItem("highscore")) 
        { 
            localStorage.setItem("highscore", this.score);
        }
    }
        if (this.gameOver && !this.endgame.isPlaying) {
            this.scene.start('EndGame', { totalScore: this.score })
        }

    this.sky.tilePositionY -= 0.5; //adding functionality to go in the upward dir.
    if (this.cursors.left.isDown) {
        this.jet.setVelocityX(-150);
    } else if (this.cursors.right.isDown) {
        this.jet.setVelocityX(150);
    } else {
        this.jet.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.jet.setVelocityY(-150);
    } else if (this.cursors.down.isDown) {
        this.jet.setVelocityY(150);
    } else {
        this.jet.setVelocityY(0);
    }
    

this.checkForRepos(this.bombs)
        this.checkForRepos(this.coins)
    }
    checkForRepos(bombs) {
        let game = this;
        bombs.children.iterate(function (bomb) {
            if (bomb.y > config.height) {
                game.resetPos(bomb);
            }
        })
    }
    resetPos(bomb) {
        bomb.y = 0;
        let randomX = Phaser.Math.Between(15, config.width - 15);
        bomb.x = randomX;
    }
}

