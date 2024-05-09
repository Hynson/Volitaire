class VolitaireEnd extends Phaser.Scene {
    constructor(){
        super("volitaireEnd");
        this.my = {sprite: {}, text: {}};
    }
    preload(){
        this.load.setPath("./assets/");

        this.load.atlasXML("spaceShoot1", "sheet.png", "sheet.xml");
        this.load.atlasXML("spaceShoot2", "spaceShooter2_spritesheet.png", "spaceShooter2_spritesheet.xml");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.image("background","darkPurple.png");
    }
    init (data)
    {
        console.log('init', data);

        this.finalScore = data.myScore;
    }
    create(){
        let my = this.my;
        const {width, height} = this.scale;
        this.bg = this.add.tileSprite(0,0,width,height,"background").setScale(2);
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.scene.stop("volitaireGame");
        const gameover = this.add.bitmapText(230, 200, "rocketSquare", "GAME OVER", 50);
        const restart = this.add.bitmapText(85, 450, "rocketSquare", "Press SPACE to restart the simulation",25);
        const score = this.add.bitmapText(230, 250, "rocketSquare", "Final Score: " + this.finalScore);
        gameover.setBlendMode(Phaser.BlendModes.ADD);
        restart.setBlendMode(Phaser.BlendModes.ADD);
        score.setBlendMode(Phaser.BlendModes.ADD);
    }

    update(){
        this.bg.tilePositionX -= 0.3;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("volitaireGame");
        }
    
    }


}