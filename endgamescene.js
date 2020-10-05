class endgamescene extends Phaser.Scene {
    constructor() {
        super('EndGame')
    }

    init(data) {
        this.score = data.totalScore;
    }

    preload() {
        this.load.image('end-game', 'game-end.jpeg')
        this.load.image('playagain', 'playagain.jpeg')
    }

    create() {
        this.add.image(400, 300, 'end-game').setScale(0.7)
        this.startbtn = this.add.image(400,300, 'playgain')
        this.startbtn.setInteractive();                       //setInteractive
        this.startbtn.on('pointerdown', this.startGames, this)
        this.add.text(180, 50, 'Your Score : ' + this.score, { fontSize: 48 })
       // this.add.text(180,50, 'highscore:' + this.highs,{fontSize:60}       )
    }
    startGames() {
        this.scene.start('Playy');
    }
        
    
}