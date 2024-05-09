class VolitaireGame extends Phaser.Scene {
    constructor() {
        super("volitaireGame");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];
        this.my.sprite.gruntBullet = []; 
        this.my.sprite.doubleGruntBullet = []; 
        this.my.sprite.tripleGruntBullet = []; 
        this.my.sprite.bomberBullet = [];  
        this.lives = 3;
        this.maxLives = 9;
        this.myScore = 0;
        this.displayScore = 0;
        this.pointstoLife = 0;
        this.maxBullets = 5;           // Don't create more than this many bullets
        this.maxEnemyBullets = 100;
        this.maxSplit = 5;
        this.bulletCooldown = 10;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.splitNow = 0;

    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlasXML("spaceShoot1", "sheet.png", "sheet.xml");
        this.load.atlasXML("spaceShoot2", "spaceShooter2_spritesheet.png", "spaceShooter2_spritesheet.xml");

   
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.image("background","darkPurple.png");

        this.load.audio("pl_fire", "sfx_shieldUp.ogg");
        this.load.audio("pl_split", "sfx_shieldDown.ogg");
        this.load.audio("pl_die", "sfx_lose.ogg");
        this.load.audio("enemyfire", "sfx_laser1.ogg");
        this.load.audio("enemyfire2", "sfx_laser2.ogg");
        this.load.audio("extralife", "sfx_zap.ogg");
    }
    
    create() {
        let my = this.my;
    
        const {width, height} = this.scale;
        this.bg = this.add.tileSprite(0,0,width,height,"background").setScale(2);

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "spaceShoot2", "spaceShips_007.png");
        my.sprite.player.setScale(0.35);

        my.sprite.grunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyBlack1.png");
        my.sprite.doublegrunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyBlue2.png");
        my.sprite.triplegrunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyGreen3.png");
        my.sprite.bomber = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyRed4.png");
        my.sprite.grunt.setScale(0.35);
        my.sprite.doublegrunt.setScale(0.35);
        my.sprite.triplegrunt.setScale(0.35);
        my.sprite.bomber.setScale(0.35);

        //Score Values
        my.sprite.grunt.scorePoints = 10;
        my.sprite.doublegrunt.scorePoints = 15;
        my.sprite.triplegrunt.scorePoints = 20;
        my.sprite.bomber.scorePoints = 25;

        // In this approach we *do* create all of the bullet sprites in create(), since we will just
        // keep reusing them
        for (let i=0; i < this.maxBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.bullet.push(this.add.sprite(-100, -100, "spaceShoot2", "spaceMissiles_003.png"));
            my.sprite.bullet[i].visible = false;
        }

        for (let i=0; i < this.maxEnemyBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.gruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed05.png"));
            my.sprite.doubleGruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed05.png"));
            my.sprite.tripleGruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed05.png"));
            my.sprite.bomberBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed05.png"));
            my.sprite.gruntBullet[i].visible = false;
            my.sprite.bomberBullet[i].visible = false;
        }

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            framerate: 30,
            repeat: 5,
            hideOnComplete: true
        });

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 6;
        this.bulletSpeed = 7;

        // Put score on screen
        my.text.score = this.add.bitmapText(550, 0, "rocketSquare", "Score " + this.myScore);
        my.text.life = this.add.bitmapText(640, 50, "rocketSquare", "Lives " + this.lives);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Fixed Array Bullet.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

    }

    update() {
        let my = this.my;
        this.bg.tilePositionX -= 0.3;
        this.bulletCooldownCounter--;
        this.my.sprite.grunt.y++;
        this.my.sprite.doublegrunt.y++;
        this.my.sprite.triplegrunt.y++;
        this.my.sprite.bomber.y++;

        if (this.my.sprite.grunt.y > 600){
            this.my.sprite.grunt.x = Math.random()*config.width;
            this.my.sprite.grunt.y = 40
        }

        if (this.my.sprite.doublegrunt.y > 600){
            this.my.sprite.doublegrunt.x = Math.random()*config.width;
            this.my.sprite.doublegrunt.y = 40
        }

        if (this.my.sprite.triplegrunt.y > 600){
            this.my.sprite.triplegrunt.x = Math.random()*config.width;
            this.my.sprite.triplegrunt.y = 40
        }

        if (this.my.sprite.bomber.y > 600){
            this.my.sprite.bomber.x = Math.random()*config.width;
            this.my.sprite.bomber.y = 40
        }

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (this.bulletCooldownCounter < 0) {
                // Check for an available bullet
                for (let bullet of my.sprite.bullet) {
                    // If the bullet is invisible, it's available
                    if (!bullet.visible) {
                        bullet.x = my.sprite.player.x;
                        bullet.y = my.sprite.player.y - (bullet.displayHeight/2);
                        bullet.visible = true;
                        this.sound.play("pl_fire", {
                            volume: 1   // Can adjust volume using this, goes from 0 to 1
                        });
                        this.bulletCooldownCounter = this.bulletCooldown;
                
                        
                        break;    // Exit the loop, so we only activate one bullet at a time
                    } else {
                        if (bullet.visible) {
                            this.sound.play("pl_split", {
                                volume: 1   // Can adjust volume using this, goes from 0 to 1
                            });
                           for (let bullet of my.sprite.bullet) {
                            for (let i=0; i < this.maxBullets; i++) {
                                // create a sprite which is offscreen and invisible
                                bullet.x = my.sprite.bullet[0].x
                                bullet.y = my.sprite.bullet[0].y
                                my.sprite.bullet[0].visible = false;
                                if (i == 1){
                                    my.sprite.bullet[1].x = bullet.x - 30;
                                    my.sprite.bullet[1].y = bullet.y - 50;
                                    my.sprite.bullet[1].visible = true;
                                }
                                if (i == 2){
                                    my.sprite.bullet[2].x = bullet.x - 60;
                                    my.sprite.bullet[2].y = bullet.y;
                                    my.sprite.bullet[2].visible = true;
                                }
                                if (i == 3){
                                    my.sprite.bullet[3].x = bullet.x + 30;
                                    my.sprite.bullet[3].y = bullet.y - 50;
                                    my.sprite.bullet[3].visible = true;
                              }
                                if (i == 4){
                                    my.sprite.bullet[4].x = bullet.x + 60;
                                    my.sprite.bullet[4].y = bullet.y;
                                    my.sprite.bullet[4].visible = true;
                                    
                                    this.bulletCooldownCounter = this.bulletCooldown;
                                    break;
                                }
    

                            }
                        }
                    }
                    
                }
            }
        }
            
        }



        // Make all of the bullets move
        for (let gbullet of my.sprite.gruntBullet) {
            // if the bullet is visible it's active, so move it
            if (gbullet.visible) {
                gbullet.y += this.bulletSpeed;
            }
        
            if (gbullet.y > 600) {
                gbullet.visible = false;
            }
                                    
        }

        // Make all of the bullets move
        for (let dbgbullet of my.sprite.doubleGruntBullet) {
            // if the bullet is visible it's active, so move it
            if (dbgbullet.visible) {
                dbgbullet.y += this.bulletSpeed;
            }
                
            if (dbgbullet.y > 600) {
                dbgbullet.visible = false;
            }
            
        }
       
        
        // Make all of the bullets move
        for (let tribullet of my.sprite.tripleGruntBullet) {
            // if the bullet is visible it's active, so move it
            if (tribullet.visible) {
                tribullet.y += this.bulletSpeed;
            }
                
            if (tribullet.y > 600) {
                tribullet.visible = false;
            }
                           
        }
        

        // Make all of the bullets move
        for (let bbullet of my.sprite.bomberBullet) {
            // if the bullet is visible it's active, so move it
            if (bbullet.visible) {
                bbullet.y += this.bulletSpeed;
                for (let i=0; i < this.maxEnemyBullets; i++) {
                    if (i == 1){
                        my.sprite.bomberBullet[1].x -= 0.50;
                        my.sprite.bomberBullet[1].y -= 0.75;
                    }
                    if (i == 2){
                        my.sprite.bomberBullet[2].x -= 0.75;
                        my.sprite.bomberBullet[2].y -= 0.75;
                    }
                    if (i == 3){
                        my.sprite.bomberBullet[3].x += 0.50;
                        my.sprite.bomberBullet[3].y -= 0.75;
                    }
                    if (i == 4){
                        my.sprite.bomberBullet[4].x += 0.75;
                        my.sprite.bomberBullet[4].y -= 0.75;
                    }
                }
                
            }
                
            if (bbullet.y > 600) {
                bbullet.visible = false;
            }
                                            
        }
                    
        

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            // if the bullet is visible it's active, so move it
            if (bullet.visible) {
                bullet.y -= this.bulletSpeed;
                for (let i=0; i < this.maxSplit; i++) {
                    if (i == 1){
                        my.sprite.bullet[1].x -= 0.50;
                        my.sprite.bullet[1].y -= 0.75;
                    }
                    if (i == 2){
                        my.sprite.bullet[2].x -= 0.75;
                        my.sprite.bullet[2].y -= 0.75;
                    }
                    if (i == 3){
                        my.sprite.bullet[3].x += 0.50;
                        my.sprite.bullet[3].y -= 0.75;
                    }
                    if (i == 4){
                        my.sprite.bullet[4].x += 0.75;
                        my.sprite.bullet[4].y -= 0.75;
                    }
                }
                
            }

            // Did the bullet move offscreen? If so,
            // make it inactive (make it invisible)
            // This allows us to re-use bullet sprites
            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }


        
        // Check for collision with the grunt
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.grunt, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.grunt.x, my.sprite.grunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let gbullet of my.sprite.gruntBullet){
                        gbullet.x = my.sprite.grunt.x;
                        gbullet.y = my.sprite.grunt.y;
                        gbullet.visible = true;
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.grunt.visible = false;
                my.sprite.grunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.grunt.scorePoints;
                this.pointstoLife += my.sprite.grunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.grunt.x = Math.random()*config.width;
                    this.my.sprite.grunt.y = 40;
                    this.my.sprite.grunt.visible = true;
                }, this);
            }
        }
                //Check for collateral collision with the grunt
                for (let gbullet of my.sprite.gruntBullet) {
                    if (this.collides(my.sprite.grunt, gbullet)) {
                        // start animation
                        this.puff = this.add.sprite(my.sprite.grunt.x, my.sprite.grunt.y, "whitePuff03").setScale(0.25).play("puff");
                        for(let gbullet of my.sprite.gruntBullet){
                                gbullet.x = my.sprite.grunt.x;
                                gbullet.y = my.sprite.grunt.y;
                                gbullet.visible = true;
                        }
                        // clear out bullet -- put y offscreen, will get reaped next update
                        gbullet.y = -100;
                        my.sprite.grunt.visible = false;
                        my.sprite.grunt.x = -100;
                        this.sound.play("enemyfire", {
                            volume: 1   // Can adjust volume using this, goes from 0 to 1
                        });
                        //update score
                        this.myScore += my.sprite.grunt.scorePoints;
                        this.pointstoLife += my.sprite.grunt.scorePoints;
                        this.updateScore(this.myScore);
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            this.my.sprite.grunt.x = Math.random()*config.width;
                            this.my.sprite.grunt.y = 40;
                            this.my.sprite.grunt.visible = true;
                        }, this);
                
                    } else if (gbullet.visible && this.collides(my.sprite.doublegrunt, gbullet)) {
                         
                            // start animation
                            this.puff = this.add.sprite(my.sprite.doublegrunt.x, my.sprite.doublegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                            for(let dbgbullet of my.sprite.doubleGruntBullet){
                                for (let i=0; i < 3; i++) {
                                    dbgbullet.x = my.sprite.doublegrunt.x;
                                    dbgbullet.y = my.sprite.doublegrunt.y;
                                    my.sprite.doubleGruntBullet[0].visible = true;
                                if (i == 1){
                                    my.sprite.doubleGruntBullet[1].x = dbgbullet.x - 30;
                                    my.sprite.doubleGruntBullet[1].y = dbgbullet.y - 50;
                                    my.sprite.doubleGruntBullet[1].visible = true;
                                } 
                            } 
                        }
                            // clear out bullet -- put y offscreen, will get reaped next update
                            gbullet.y = -100;
                            my.sprite.doublegrunt.visible = false;
                            my.sprite.doublegrunt.x = -100;
                            this.sound.play("enemyfire", {
                                volume: 1   // Can adjust volume using this, goes from 0 to 1
                            });
                            //update score
                            this.myScore += my.sprite.doublegrunt.scorePoints;
                            this.pointstoLife += my.sprite.doublegrunt.scorePoints;
                            this.updateScore(this.myScore);
                            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                                this.my.sprite.doublegrunt.x = Math.random()*config.width;
                                this.my.sprite.doublegrunt.y = 40;
                                this.my.sprite.doublegrunt.visible = true;
                            }, this);
                            
                    } else if (gbullet.visible && this.collides(my.sprite.triplegrunt, gbullet)) {
                            // start animation
                            this.puff = this.add.sprite(my.sprite.triplegrunt.x, my.sprite.triplegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                            for(let tribullet of my.sprite.tripleGruntBullet){
                                for (let i=0; i < 5; i++) {
                                    tribullet.x = my.sprite.triplegrunt.x;
                                    tribullet.y = my.sprite.triplegrunt.y;
                                    my.sprite.tripleGruntBullet[0].visible = true;
                                if (i == 1){
                                    my.sprite.tripleGruntBullet[1].x = tribullet.x - 30;
                                    my.sprite.tripleGruntBullet[1].y = tribullet.y
                                    my.sprite.tripleGruntBullet[1].visible = true;
                                }
                                if (i == 2){
                                    my.sprite.tripleGruntBullet[2].x = tribullet.x + 30;
                                    my.sprite.tripleGruntBullet[2].y = tribullet.y;
                                    my.sprite.tripleGruntBullet[2].visible = true;
                                }
            
                        }
                    }
                            // clear out bullet -- put y offscreen, will get reaped next update
                            gbullet.y = -100;
                            my.sprite.triplegrunt.visible = false;
                            my.sprite.triplegrunt.x = -100;
                            this.sound.play("enemyfire2", {
                                volume: 1   // Can adjust volume using this, goes from 0 to 1
                            });
                            //update score
                            this.myScore += my.sprite.triplegrunt.scorePoints;
                            this.pointstoLife += my.sprite.triplegrunt.scorePoints;
                            this.updateScore(this.myScore);
                            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                                this.my.sprite.triplegrunt.x = Math.random()*config.width;
                                this.my.sprite.triplegrunt.y = 40;
                                this.my.sprite.triplegrunt.visible = true;
                            }, this);
                    
                } else if (gbullet.visible && this.collides(my.sprite.bomber, gbullet)) {
                    // start animation
                    this.puff = this.add.sprite(my.sprite.bomber.x, my.sprite.bomber.y, "whitePuff03").setScale(0.25).play("puff");
                    for(let bbullet of my.sprite.bomberBullet){
                        for (let i=0; i < 5; i++) {
                            bbullet.x = my.sprite.bomber.x;
                            bbullet.y = my.sprite.bomber.y;
                        if (i == 1){
                            my.sprite.bomberBullet[1].x = bbullet.x - 30;
                            my.sprite.bomberBullet[1].y = bbullet.y - 50;
                            my.sprite.bomberBullet[1].visible = true;
                        }
                        if (i == 2){
                            my.sprite.bomberBullet[2].x = bbullet.x - 60;
                            my.sprite.bomberBullet[2].y = bbullet.y;
                            my.sprite.bomberBullet[2].visible = true;
                        }
                        if (i == 3){
                            my.sprite.bomberBullet[3].x = bbullet.x + 30;
                            my.sprite.bomberBullet[3].y = bbullet.y - 50;
                            my.sprite.bomberBullet[3].visible = true;
                        }
                        if (i == 4){
                            my.sprite.bomberBullet[4].x = bbullet.x + 60;
                            my.sprite.bomberBullet[4].y = bbullet.y;
                            my.sprite.bomberBullet[4].visible = true;
                        }
                    }
                }
                    // clear out bullet -- put y offscreen, will get reaped next update
                    gbullet.y = -100;
                    my.sprite.bomber.visible = false;
                    my.sprite.bomber.x = -100;
                    this.sound.play("enemyfire2", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    });
                    //update score
                    this.myScore += my.sprite.bomber.scorePoints;
                    this.pointstoLife += my.sprite.bomber.scorePoints;
                    this.updateScore(this.myScore);
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.my.sprite.bomber.x = Math.random()*config.width;
                        this.my.sprite.bomber.y = 40;
                        this.my.sprite.bomber.visible = true;
                    }, this);
            }
            }



        // Check for collision with the double grunt
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.doublegrunt, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.doublegrunt.x, my.sprite.doublegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let dbgbullet of my.sprite.doubleGruntBullet){
                        for (let i=0; i < 3; i++) {
                            dbgbullet.x = my.sprite.doublegrunt.x;
                            dbgbullet.y = my.sprite.doublegrunt.y;
                            my.sprite.doubleGruntBullet[0].visible = true;
                        if (i == 1){
                            my.sprite.doubleGruntBullet[1].x = dbgbullet.x - 30;
                            my.sprite.doubleGruntBullet[1].y = dbgbullet.y - 50;
                            my.sprite.doubleGruntBullet[1].visible = true;
                        }               
                }
            }
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.doublegrunt.visible = false;
                my.sprite.doublegrunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.doublegrunt.scorePoints;
                this.pointstoLife += my.sprite.doublegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
                }, this);
        
            } 
        }

         // Check for collateral collision with the double grunt
         for (let dbgbullet of my.sprite.doubleGruntBullet) {
            if (dbgbullet.visible && this.collides(my.sprite.doublegrunt, dbgbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.doublegrunt.x, my.sprite.doublegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let dbgbullet of my.sprite.doubleGruntBullet){
                        for (let i=0; i < 3; i++) {
                            dbgbullet.x = my.sprite.doublegrunt.x;
                            dbgbullet.y = my.sprite.doublegrunt.y;
                            my.sprite.doubleGruntBullet[0].visible = true;
                        if (i == 1){
                            my.sprite.doubleGruntBullet[1].x = dbgbullet.x - 30;
                            my.sprite.doubleGruntBullet[1].y = dbgbullet.y - 50;
                            my.sprite.doubleGruntBullet[1].visible = true;
                        }               
                }
            }
                // clear out bullet -- put y offscreen, will get reaped next update
                dbgbullet.y = -100;
                my.sprite.doublegrunt.visible = false;
                my.sprite.doublegrunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.doublegrunt.scorePoints;
                this.pointstoLife += my.sprite.doublegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
                }, this);
        
            } else if (dbgbullet.visible && this.collides(my.sprite.grunt, dbgbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.grunt.x, my.sprite.grunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let gbullet of my.sprite.gruntBullet){
                        gbullet.x = my.sprite.grunt.x;
                        gbullet.y = my.sprite.grunt.y;
                        gbullet.visible = true;
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                dbgbullet.y = -100;
                my.sprite.grunt.visible = false;
                my.sprite.grunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.grunt.scorePoints;
                this.pointstoLife += my.sprite.grunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.grunt.x = Math.random()*config.width;
                    this.my.sprite.grunt.y = 40;
                    this.my.sprite.grunt.visible = true;
                }, this);
        
            } else if (dbgbullet.visible && this.collides(my.sprite.triplegrunt, dbgbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.triplegrunt.x, my.sprite.triplegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let tribullet of my.sprite.tripleGruntBullet){
                    for (let i=0; i < 5; i++) {
                        tribullet.x = my.sprite.triplegrunt.x;
                        tribullet.y = my.sprite.triplegrunt.y;
                        my.sprite.tripleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.tripleGruntBullet[1].x = tribullet.x - 30;
                        my.sprite.tripleGruntBullet[1].y = tribullet.y
                        my.sprite.tripleGruntBullet[1].visible = true;
                    }
                    if (i == 2){
                        my.sprite.tripleGruntBullet[2].x = tribullet.x + 30;
                        my.sprite.tripleGruntBullet[2].y = tribullet.y;
                        my.sprite.tripleGruntBullet[2].visible = true;
                    }

            } 
        }
                // clear out bullet -- put y offscreen, will get reaped next update
                dbgbullet.y = -100;
                my.sprite.triplegrunt.visible = false;
                my.sprite.triplegrunt.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.triplegrunt.scorePoints;
                this.pointstoLife += my.sprite.triplegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.triplegrunt.x = Math.random()*config.width;
                    this.my.sprite.triplegrunt.y = 40;
                    this.my.sprite.triplegrunt.visible = true;
                }, this);
                
        } else if (dbgbullet.visible && this.collides(my.sprite.bomber, dbgbullet)) {
            // start animation
            this.puff = this.add.sprite(my.sprite.bomber.x, my.sprite.bomber.y, "whitePuff03").setScale(0.25).play("puff");
            for(let bbullet of my.sprite.bomberBullet){
                for (let i=0; i < 5; i++) {
                    bbullet.x = my.sprite.bomber.x;
                    bbullet.y = my.sprite.bomber.y;
                if (i == 1){
                    my.sprite.bomberBullet[1].x = bbullet.x - 30;
                    my.sprite.bomberBullet[1].y = bbullet.y - 50;
                    my.sprite.bomberBullet[1].visible = true;
                }
                if (i == 2){
                    my.sprite.bomberBullet[2].x = bbullet.x - 60;
                    my.sprite.bomberBullet[2].y = bbullet.y;
                    my.sprite.bomberBullet[2].visible = true;
                }
                if (i == 3){
                    my.sprite.bomberBullet[3].x = bbullet.x + 30;
                    my.sprite.bomberBullet[3].y = bbullet.y - 50;
                    my.sprite.bomberBullet[3].visible = true;
                }
                if (i == 4){
                    my.sprite.bomberBullet[4].x = bbullet.x + 60;
                    my.sprite.bomberBullet[4].y = bbullet.y;
                    my.sprite.bomberBullet[4].visible = true;
                }
            }
        }
            // clear out bullet -- put y offscreen, will get reaped next update
            dbgbullet.y = -100;
            my.sprite.bomber.visible = false;
            my.sprite.bomber.x = -100;
            this.sound.play("enemyfire2", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            //update score
            this.myScore += my.sprite.bomber.scorePoints;
            this.pointstoLife += my.sprite.bomber.scorePoints;
            this.updateScore(this.myScore);
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.bomber.x = Math.random()*config.width;
                this.my.sprite.bomber.y = 40;
                this.my.sprite.bomber.visible = true;
            }, this);
    }
    }
       

        // Check for collision with the triple grunt
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.triplegrunt, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.triplegrunt.x, my.sprite.triplegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let tribullet of my.sprite.tripleGruntBullet){
                    for (let i=0; i < 5; i++) {
                        tribullet.x = my.sprite.triplegrunt.x;
                        tribullet.y = my.sprite.triplegrunt.y;
                        my.sprite.tripleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.tripleGruntBullet[1].x = tribullet.x - 30;
                        my.sprite.tripleGruntBullet[1].y = tribullet.y
                        my.sprite.tripleGruntBullet[1].visible = true;
                    }
                    if (i == 2){
                        my.sprite.tripleGruntBullet[2].x = tribullet.x + 30;
                        my.sprite.tripleGruntBullet[2].y = tribullet.y;
                        my.sprite.tripleGruntBullet[2].visible = true;
                    }

            }
        }
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.triplegrunt.visible = false;
                my.sprite.triplegrunt.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.triplegrunt.scorePoints;
                this.pointstoLife += my.sprite.triplegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.triplegrunt.x = Math.random()*config.width;
                    this.my.sprite.triplegrunt.y = 40;
                    this.my.sprite.triplegrunt.visible = true;
                }, this);
        
            }
        }

        // Check for collateral collision with the triple grunt
        for (let tribullet of my.sprite.tripleGruntBullet) {
            if (tribullet.visible && this.collides(my.sprite.triplegrunt, tribullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.triplegrunt.x, my.sprite.triplegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let tribullet of my.sprite.tripleGruntBullet){
                    for (let i=0; i < 5; i++) {
                        tribullet.x = my.sprite.triplegrunt.x;
                        tribullet.y = my.sprite.triplegrunt.y;
                        my.sprite.tripleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.tripleGruntBullet[1].x = tribullet.x - 30;
                        my.sprite.tripleGruntBullet[1].y = tribullet.y
                        my.sprite.tripleGruntBullet[1].visible = true;
                    }
                    if (i == 2){
                        my.sprite.tripleGruntBullet[2].x = tribullet.x + 30;
                        my.sprite.tripleGruntBullet[2].y = tribullet.y;
                        my.sprite.tripleGruntBullet[2].visible = true;
                    }

            }
        }
                // clear out bullet -- put y offscreen, will get reaped next update
                tribullet.y = -100;
                my.sprite.triplegrunt.visible = false;
                my.sprite.triplegrunt.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                //update score
                this.myScore += my.sprite.triplegrunt.scorePoints;
                this.pointstoLife += my.sprite.triplegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.triplegrunt.x = Math.random()*config.width;
                    this.my.sprite.triplegrunt.y = 40;
                    this.my.sprite.triplegrunt.visible = true;
                }, this);
        
            } else if (tribullet.visible && this.collides(my.sprite.grunt, tribullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.grunt.x, my.sprite.grunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let gbullet of my.sprite.gruntBullet){
                        gbullet.x = my.sprite.grunt.x;
                        gbullet.y = my.sprite.grunt.y;
                        gbullet.visible = true;
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                tribullet.y = -100;
                my.sprite.grunt.visible = false;
                my.sprite.grunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.grunt.scorePoints;
                this.pointstoLife += my.sprite.grunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.grunt.x = Math.random()*config.width;
                    this.my.sprite.grunt.y = 40;
                    this.my.sprite.grunt.visible = true;
                }, this);
        
            } else if (tribullet.visible && this.collides(my.sprite.doublegrunt, tribullet)) {
                         
                // start animation
                this.puff = this.add.sprite(my.sprite.doublegrunt.x, my.sprite.doublegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let dbgbullet of my.sprite.doubleGruntBullet){
                    for (let i=0; i < 3; i++) {
                        dbgbullet.x = my.sprite.doublegrunt.x;
                        dbgbullet.y = my.sprite.doublegrunt.y;
                        my.sprite.doubleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.doubleGruntBullet[1].x = dbgbullet.x - 30;
                        my.sprite.doubleGruntBullet[1].y = dbgbullet.y - 50;
                        my.sprite.doubleGruntBullet[1].visible = true;
                    } 
                } 
            }
                // clear out bullet -- put y offscreen, will get reaped next update
                tribullet.y = -100;
                my.sprite.doublegrunt.visible = false;
                my.sprite.doublegrunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.doublegrunt.scorePoints;
                this.pointstoLife += my.sprite.doublegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
                }, this);
                
            } else if (tribullet.visible && this.collides(my.sprite.bomber, tribullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.bomber.x, my.sprite.bomber.y, "whitePuff03").setScale(0.25).play("puff");
                for(let bbullet of my.sprite.bomberBullet){
                        for (let i=0; i < 5; i++) {
                            bbullet.x = my.sprite.bomber.x;
                            bbullet.y = my.sprite.bomber.y;
                        if (i == 1){
                            my.sprite.bomberBullet[1].x = bbullet.x - 30;
                            my.sprite.bomberBullet[1].y = bbullet.y - 50;
                            my.sprite.bomberBullet[1].visible = true;
                        }
                        if (i == 2){
                            my.sprite.bomberBullet[2].x = bbullet.x - 60;
                            my.sprite.bomberBullet[2].y = bbullet.y;
                            my.sprite.bomberBullet[2].visible = true;
                        }
                        if (i == 3){
                            my.sprite.bomberBullet[3].x = bbullet.x + 30;
                            my.sprite.bomberBullet[3].y = bbullet.y - 50;
                            my.sprite.bomberBullet[3].visible = true;
                        }
                        if (i == 4){
                            my.sprite.bomberBullet[4].x = bbullet.x + 60;
                            my.sprite.bomberBullet[4].y = bbullet.y;
                            my.sprite.bomberBullet[4].visible = true;
                        }
                    }
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                tribullet.y = -100;
                my.sprite.bomber.visible = false;
                my.sprite.bomber.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.bomber.scorePoints;
                this.pointstoLife += my.sprite.bomber.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.bomber.visible = true;
                    this.my.sprite.bomber.x = Math.random()*config.width;
                    this.my.sprite.bomber.y = 40;
                }, this);
        
            }  
        }        

        
        // Check for collision with the bomber
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.bomber, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.bomber.x, my.sprite.bomber.y, "whitePuff03").setScale(0.25).play("puff");
                for(let bbullet of my.sprite.bomberBullet){
                        for (let i=0; i < 5; i++) {
                            bbullet.x = my.sprite.bomber.x;
                            bbullet.y = my.sprite.bomber.y;
                        if (i == 1){
                            my.sprite.bomberBullet[1].x = bbullet.x - 30;
                            my.sprite.bomberBullet[1].y = bbullet.y - 50;
                            my.sprite.bomberBullet[1].visible = true;
                        }
                        if (i == 2){
                            my.sprite.bomberBullet[2].x = bbullet.x - 60;
                            my.sprite.bomberBullet[2].y = bbullet.y;
                            my.sprite.bomberBullet[2].visible = true;
                        }
                        if (i == 3){
                            my.sprite.bomberBullet[3].x = bbullet.x + 30;
                            my.sprite.bomberBullet[3].y = bbullet.y - 50;
                            my.sprite.bomberBullet[3].visible = true;
                        }
                        if (i == 4){
                            my.sprite.bomberBullet[4].x = bbullet.x + 60;
                            my.sprite.bomberBullet[4].y = bbullet.y;
                            my.sprite.bomberBullet[4].visible = true;
                        }
                    }
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.bomber.visible = false;
                my.sprite.bomber.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.bomber.scorePoints;
                this.pointstoLife += my.sprite.bomber.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.bomber.visible = true;
                    this.my.sprite.bomber.x = Math.random()*config.width;
                    this.my.sprite.bomber.y = 40;
                }, this);
        
            }
        }

        // Check for collateral collision with the bomber
        for (let bbullet of my.sprite.bomberBullet) {
            if (bbullet.visible && this.collides(my.sprite.bomber, bbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.bomber.x, my.sprite.bomber.y, "whitePuff03").setScale(0.25).play("puff");
                for(let bbullet of my.sprite.bomberBullet){
                        for (let i=0; i < 5; i++) {
                            bbullet.x = my.sprite.bomber.x;
                            bbullet.y = my.sprite.bomber.y;
                        if (i == 1){
                            my.sprite.bomberBullet[1].x = bbullet.x - 30;
                            my.sprite.bomberBullet[1].y = bbullet.y - 50;
                            my.sprite.bomberBullet[1].visible = true;
                        }
                        if (i == 2){
                            my.sprite.bomberBullet[2].x = bbullet.x - 60;
                            my.sprite.bomberBullet[2].y = bbullet.y;
                            my.sprite.bomberBullet[2].visible = true;
                        }
                        if (i == 3){
                            my.sprite.bomberBullet[3].x = bbullet.x + 30;
                            my.sprite.bomberBullet[3].y = bbullet.y - 50;
                            my.sprite.bomberBullet[3].visible = true;
                        }
                        if (i == 4){
                            my.sprite.bomberBullet[4].x = bbullet.x + 60;
                            my.sprite.bomberBullet[4].y = bbullet.y;
                            my.sprite.bomberBullet[4].visible = true;
                        }
                    }
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                bbullet.y = -100;
                my.sprite.bomber.visible = false;
                my.sprite.bomber.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.bomber.scorePoints;
                this.pointstoLife += my.sprite.bomber.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.bomber.visible = true;
                    this.my.sprite.bomber.x = Math.random()*config.width;
                    this.my.sprite.bomber.y = 40;
                }, this);
        
            } else if (bbullet.visible && this.collides(my.sprite.triplegrunt, bbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.triplegrunt.x, my.sprite.triplegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let tribullet of my.sprite.tripleGruntBullet){
                    for (let i=0; i < 5; i++) {
                        tribullet.x = my.sprite.triplegrunt.x;
                        tribullet.y = my.sprite.triplegrunt.y;
                        my.sprite.tripleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.tripleGruntBullet[1].x = tribullet.x - 30;
                        my.sprite.tripleGruntBullet[1].y = tribullet.y
                        my.sprite.tripleGruntBullet[1].visible = true;
                    }
                    if (i == 2){
                        my.sprite.tripleGruntBullet[2].x = tribullet.x + 30;
                        my.sprite.tripleGruntBullet[2].y = tribullet.y;
                        my.sprite.tripleGruntBullet[2].visible = true;
                    }

            }
        }
                // clear out bullet -- put y offscreen, will get reaped next update
                bbullet.y = -100;
                my.sprite.triplegrunt.visible = false;
                my.sprite.triplegrunt.x = -100;
                this.sound.play("enemyfire2", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.triplegrunt.scorePoints;
                this.pointstoLife += my.sprite.triplegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.triplegrunt.x = Math.random()*config.width;
                    this.my.sprite.triplegrunt.y = 40;
                    this.my.sprite.triplegrunt.visible = true;
                }, this);
        
            } else if (bbullet.visible && this.collides(my.sprite.grunt, bbullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.grunt.x, my.sprite.grunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let gbullet of my.sprite.gruntBullet){
                        gbullet.x = my.sprite.grunt.x;
                        gbullet.y = my.sprite.grunt.y;
                        gbullet.visible = true;
                }
                // clear out bullet -- put y offscreen, will get reaped next update
                bbullet.y = -100;
                my.sprite.grunt.visible = false;
                my.sprite.grunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.grunt.scorePoints;
                this.pointstoLife += my.sprite.grunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.grunt.x = Math.random()*config.width;
                    this.my.sprite.grunt.y = 40;
                    this.my.sprite.grunt.visible = true;
                }, this);
        
            } else if (bbullet.visible && this.collides(my.sprite.doublegrunt, bbullet)) {
                         
                // start animation
                this.puff = this.add.sprite(my.sprite.doublegrunt.x, my.sprite.doublegrunt.y, "whitePuff03").setScale(0.25).play("puff");
                for(let dbgbullet of my.sprite.doubleGruntBullet){
                    for (let i=0; i < 3; i++) {
                        dbgbullet.x = my.sprite.doublegrunt.x;
                        dbgbullet.y = my.sprite.doublegrunt.y;
                        my.sprite.doubleGruntBullet[0].visible = true;
                    if (i == 1){
                        my.sprite.doubleGruntBullet[1].x = dbgbullet.x - 30;
                        my.sprite.doubleGruntBullet[1].y = dbgbullet.y - 50;
                        my.sprite.doubleGruntBullet[1].visible = true;
                    } 
                } 
            }
                // clear out bullet -- put y offscreen, will get reaped next update
                bbullet.y = -100;
                my.sprite.doublegrunt.visible = false;
                my.sprite.doublegrunt.x = -100;
                this.sound.play("enemyfire", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore += my.sprite.doublegrunt.scorePoints;
                this.pointstoLife += my.sprite.doublegrunt.scorePoints;
                this.updateScore(this.myScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
                }, this);
                
            }
        }

        

    for (let gbullet of my.sprite.gruntBullet){
        if (gbullet.visible && this.collides(my.sprite.player, gbullet)) {
            // start animation
            this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
            // clear out bullet -- put y offscreen, will get reaped next update
            gbullet.y = -100;
            my.sprite.player.visible = false;
            my.sprite.player.x = -100;
            this.sound.play("pl_die", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.player.x = game.config.width/2;
                this.my.sprite.player.y = game.config.height - 40;
                this.lives = this.lives - 1;
                this.updateLife(this.lives);
                this.my.sprite.player.visible = true;
            }, this);
        }
    }

    for (let dbgbullet of my.sprite.doubleGruntBullet){
        if (dbgbullet.visible && this.collides(my.sprite.player, dbgbullet)) {
            // start animation
            this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
            // clear out bullet -- put y offscreen, will get reaped next update
            dbgbullet.y = -100;
            my.sprite.player.visible = false;
            my.sprite.player.x = -100;
            this.sound.play("pl_die", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.player.x = game.config.width/2;
                this.my.sprite.player.y = game.config.height - 40;
                this.lives = this.lives - 1;
                this.updateLife(this.lives);
                this.my.sprite.player.visible = true;
            }, this);
        }
    }

    for (let tribullet of my.sprite.tripleGruntBullet){
        if (tribullet.visible && this.collides(my.sprite.player, tribullet)) {
            // start animation
            this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
            // clear out bullet -- put y offscreen, will get reaped next update
            tribullet.y = -100;
            my.sprite.player.visible = false;
            my.sprite.player.x = -100;
            this.sound.play("pl_die", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.player.x = game.config.width/2;
                this.my.sprite.player.y = game.config.height - 40;
                this.lives = this.lives - 1;
                this.updateLife(this.lives);
                this.my.sprite.player.visible = true;
            }, this);
        }
    }

    for (let bbullet of my.sprite.bomberBullet){
        if (bbullet.visible && this.collides(my.sprite.player, bbullet)) {
            // start animation
            this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
            // clear out bullet -- put y offscreen, will get reaped next update
            bbullet.y = -100;
            my.sprite.player.visible = false;
            my.sprite.player.x = -100;
            this.sound.play("pl_die", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.player.x = game.config.width/2;
                this.my.sprite.player.y = game.config.height - 40;
                this.lives = this.lives - 1;
                this.updateLife(this.lives);
                this.my.sprite.player.visible = true;
            }, this);
        }
    }
        
        if(this.lives < 0){
            this.displayScore = this.myScore;
            this.reset();
            this.scene.start("volitaireEnd", { myScore: this.displayScore });
        }

        if(this.pointstoLife > 1000 && this.lives < this.maxLives){
            this.lives += 1
            this.pointstoLife = 0;
            this.updateLife(this.lives);
            this.sound.play("extralife", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
        }

    }

        // A center-radius AABB collision check
        collides(a, b) {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
        }

        updateScore() {
            let my = this.my;
            my.text.score.setText("Score " + this.myScore);
        }

        reset(){
            this.lives += 3;
            this.updateLife(this.lives);
            this.myScore = 0;
            this.pointstoLife = 0;
            this.updateScore(this.myScore);
            this.my.sprite.bullet = [];
            this.my.sprite.gruntBullet = []; 
            this.my.sprite.doubleGruntBullet = []; 
            this.my.sprite.tripleGruntBullet = []; 
            this.my.sprite.bomberBullet = []; 
        }

        updateLife() {
            let my = this.my;
            my.text.life.setText("Lives " + this.lives);
        }
}
         