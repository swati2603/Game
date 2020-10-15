class startgamescene extends Phaser.Scene {
    constructor() {
        super('Playy')    //super constructor is used to invoke immediate parent class method
    }

    preload() {
        this.load.image('start-game', 'game-start.jpg')
        this.load.image('start', 'play-now.png')
    }

    create() {     
        this.add.image(400, 300, 'start-game').setScale(1.8) // setscale is used to resize the image
        this.startbtn = this.add.image(400,300, 'start')
        this.startbtn.setInteractive();                       //setInteractive
        this.startbtn.on('pointerdown', this.startGame, this)
    }

    startGame() {
        this.scene.start('Play');
    }
}
