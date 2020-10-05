class startgamescene extends Phaser.Scene {
    constructor() {
        super('Playy')
    }

    preload() {
        this.load.image('start-game', 'game-start.jpg')
        this.load.image('start', 'play-now.png')
    }

    create() {
        this.add.image(400, 300, 'start-game').setScale(1.8)
        this.startbtn = this.add.image(400,300, 'start')
        this.startbtn.setInteractive();                       //setInteractive
        this.startbtn.on('pointerdown', this.startGame, this)
    }

    startGame() {
        this.scene.start('Play');
    }
}