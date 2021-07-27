/*phaser is a HTML framework. WEbGL powered brower games. 
Web Graphics Library is a JavaScript API for rendering high-performance interactive 3D and 2D graphics
*/
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    //physics is used for adding physics properties like velocity, dir., gravity
    physics: {
        default: 'arcade', //Arcade Physics contain collision, overlap and motion methods.
    },scene: {
        preload: preload, // preload function is used for preloading all the images n audio in memory
        create: create,   //create function is used for adding all the images in screen
        update: update    // as name suggest n it's like continous loop
    }
};
var sky, jet, cursors, ammo, bombs, explosion, coin;   //variable declarations
var coinHit;
var score = 0;
var scoreText;

var gameOver=false;
var game = new Phaser.Game(config);  

function preload() {
   this.load.image('sky', 'space3.png');
    this.load.image('jet', 'jet.png');
    this.load.image('bomb', 'bomb.png');
    this.load.image('ammo', 'ammo.png');
    this.load.image('coin', 'coin.png')
    this.load.spritesheet('explosion', 'explosion.png', {   
        frameWidth: 16,                       //set width n hieght    
        frameHeight: 16
    })   
    this.load.audio('gunshot','gunshot.wav')  //first load  explosion sound
    this.load.audio('coinhit', 'coinhit.wav')
    this.load.audio('end', 'end.mp3')
    
}    

    function create() 
    {
    sky = this.add.tileSprite(800, 600, config.width, config.height, 'sky'); //tilesprite is used for moving background screen
    jet = this.physics.add.image(800,500, 'jet').setScale(0.15)
    jet.setCollideWorldBounds(true)  //stops jet not to go outside the boundary

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', shoot, this)   //pointerdiown: checks whether amouse click occurred or not

    bombs = this.physics.add.group({  //for multiple bombs
        key: 'bomb',                   
        repeat: 3,                    //four bomb  
        setXY: {                      //set position, stepX means how many steps have to br taken again
            x: 20, y: 50, stepX: Phaser.Math.Between(10, config.width - 15), stepY: Phaser.Math.Between(15, 300)
        }
    })
     //creating coins
    coins = this.physics.add.group();
    for (let i =0;i<10;i++)
    {
        let x = Phaser.Math.Between(0, config.width-15) //get random position
        let y = Phaser.Math.Between(0, 200)
        let newCoin = coins.create(x,y, 'coin')
    }
    setObjVelocity(bombs);
    setObjVelocity(coins);

    this.anims.create({
        key: 'explode',                                               //animation name: explode
        frames: this.anims.generateFrameNumbers('explosion'),         
        frameRate: 20,                                                //1 sec: 20 frames
        hideOnComplete: true
    })

    this.physics.add.collider(jet, coins, collectCoins, null, this)    //for collecting coins
    this.physics.add.collider(jet, bombs, endgame, null, this) //where to stop game
    gunshot = this.sound.add('gunshot')//adding it 
    coinHit = this.sound.add('coinhit')
    endGameMusic = this.sound.add('end')
    scoreText = this.add.text(600, 21, 'Score : 0', { fontSize: 28, fill: '#ff0000' })  //score onboard and set coordinates
   
}

function endgame(jet, bomb)
{
    endGameMusic.play()
    this.physics.pause()              //to stop everything
    jet.setTint(0xff0000)             //to change jet color
    gameOver = true;
}
function collectCoins(jet, coin) {
   coinHit.play()
    coin.disableBody(true, true)  // when both jet n coin come in contact with each other then it will become invisible
    let x = Phaser.Math.Between(0, config.width - 15)  // this is for enabling more coins
    coin.enableBody(true, x, 0, true, true)
    let xVel = Phaser.Math.Between(-100, 100);            //provide random pos. with vel.
    let yVel = Phaser.Math.Between(150, 200)
    coin.setVelocity(xVel, yVel)
    score += 10;
    scoreText.setText('Score : ' + score)
}
function setObjVelocity(bombs) {                          //set speed 
    bombs.children.iterate(function (bomb) {
        let xVel = Phaser.Math.Between(-100, 100);       //consider left n right both dir.
        let yVel = Phaser.Math.Between(150, 200)         // both are +ve (towards downward dir.)
        bomb.setVelocity(xVel, yVel)
    })
}

function shoot() {
    ammo = this.physics.add.image(jet.x, jet.y, 'ammo').setScale(0.1)
    ammo.setRotation(-Phaser.Math.PI2 / 4);
    ammo.setVelocityY(-600)
    this.physics.add.collider(ammo, bombs, destroyBomb, null, this)
}

/*function bb()
 {
     return false;
 }*/


function destroyBomb(ammo, bomb) {
    //explosion = this.add.sprite(bomb.x, bomb.y, 'explosion');
    //explosion.play('explode')
    gunshot.play()// for functioning 
   // coinhit.play()
    explosion = this.add.sprite(bomb.x, bomb.y, 'explosion').setScale(4);
    explosion.play('explode')
    explosion.setRotation(-Phaser.Math.PI2 / 4);                   //PI=180*2=360, 360/4= 90
    bomb.disableBody(true, true)                                   // to destroy bomb
    ammo.disableBody(true, true)
    let x = Phaser.Math.Between(0, config.width-15)                //after four bomb regenerate in random pos.
    let y = Phaser.Math.Between(0, 200)                            // reset,x,y,enable,show
    bomb.enableBody(true, x, 0, true, true)
    let xVel = Phaser.Math.Between(-100, 100)
        let yVel = Phaser.Math.Between(150,200)
        bomb.setVelocity(xVel, yVel)                               //speed of bomb
        score += 8;
    scoreText.setText('Score : ' + score)
}

function update() {
   
    if(gameOver){
        return 0; 
    }
    sky.tilePositionY -= 0.5;                                               //adding functionality to go in the upward dir.
    if (cursors.left.isDown) {
        jet.setVelocityX(-150);
    } else if (cursors.right.isDown) {
        jet.setVelocityX(150);
    } else {
        jet.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        jet.setVelocityY(-150);
    } else if (cursors.down.isDown) {
        jet.setVelocityY(150);
    } else {
        jet.setVelocityY(0);
    }
    checkForRepos(bombs)
    checkForRepos(coins)
}
function checkForRepos(bombs){
    bombs.children.iterate(function(bomb)
        {
            if(bomb.y > config.height)
            {
               resetPos(bomb)
            }
        })
}
function resetPos(bomb)
{
    bomb.y = 0;
    let randomX = Phaser.Math.Between(15, config.width-15)
    bomb.x = randomX;
}


   
