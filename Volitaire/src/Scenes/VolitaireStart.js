class VolitaireStart extends Phaser.Scene {
    constructor(){
        super("volitaireStart");
        this.my = {sprite: {}, text: {}};
        
    }

    preload(){
        this.load.setPath("./assets/");

        this.load.atlasXML("spaceShoot1", "sheet.png", "sheet.xml");
        this.load.atlasXML("spaceShoot2", "spaceShooter2_spritesheet.png", "spaceShooter2_spritesheet.xml");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.image("background","darkPurple.png");
    }

    create(){
        let my = this.my;
        const {width, height} = this.scale;
        this.bg = this.add.tileSprite(0,0,width,height,"background").setScale(2);
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        const name = this.add.bitmapText(285, 180, "rocketSquare", "Elijah Hynson's", 20);
        const title = this.add.bitmapText(230, 200, "rocketSquare", "Volitaire", 50);
        const objective = this.add.bitmapText(85, 300, "rocketSquare", "Wreak havoc on your virtual enemies for as long as possible.", 15);
        const controls = this.add.bitmapText(85, 350, "rocketSquare", "A to move left    D to move right", 15);
        
        const controlsTwo = this.add.bitmapText(85, 380, "rocketSquare", "Space to fire, (While missile is flying) Space again to split!", 15);
        const start = this.add.bitmapText(85, 450, "rocketSquare", "Press SPACE to begin the simulation",25);
        name.setBlendMode(Phaser.BlendModes.ADD);
        title.setBlendMode(Phaser.BlendModes.ADD);
        objective.setBlendMode(Phaser.BlendModes.ADD);
        controls.setBlendMode(Phaser.BlendModes.ADD);
        controlsTwo.setBlendMode(Phaser.BlendModes.ADD);
        start.setBlendMode(Phaser.BlendModes.ADD);

        document.getElementById('description').innerHTML = '<h2>Volitaire!</h2>'
    }

    update(){

        this.bg.tilePositionX -= 0.3;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("volitaireGame");
        }
    
    }
    
}