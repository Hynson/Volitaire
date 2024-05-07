class FixedArrayBullet extends Phaser.Scene {
    graphics;
    curve;
    path;
    constructor() {
        super("fixedArrayBullet");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];
        this.my.sprite.gruntBullet = []; 
        this.my.sprite.doubleGruntBullet = []; 
        this.my.sprite.tripleGruntBullet = []; 
        this.my.sprite.bomberBullet = [];  
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

        this.load.image("heart", "heart.png");

        this.load.image("hippo", "hippo.png");
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
    }

    create() {
        let my = this.my;
        
        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "spaceShoot2", "spaceShips_007.png");
        my.sprite.player.setScale(0.35);

        my.sprite.grunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyBlack1.png");
        my.sprite.doublegrunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyGreen3.png");
        my.sprite.triplegrunt = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyBlue2.png");
        my.sprite.bomber = this.add.sprite(Math.random()*config.width, 40, "spaceShoot1", "enemyRed4.png");
        my.sprite.grunt.setScale(0.35);
        my.sprite.doublegrunt.setScale(0.35);
        my.sprite.triplegrunt.setScale(0.35);
        my.sprite.bomber.setScale(0.35);

        // In this approach we *do* create all of the bullet sprites in create(), since we will just
        // keep reusing them
        for (let i=0; i < this.maxBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.bullet.push(this.add.sprite(-100, -100, "spaceShoot2", "spaceMissiles_003.png"));
            my.sprite.bullet[i].visible = false;
        }

        for (let i=0; i < this.maxEnemyBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.gruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed01.png"));
            my.sprite.doubleGruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed01.png"));
            my.sprite.tripleGruntBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed01.png"));
            my.sprite.bomberBullet.push(this.add.sprite(-100, -100, "spaceShoot1", "laserRed01.png"));
            my.sprite.gruntBullet[i].visible = false;
            my.sprite.bomberBullet[i].visible = false;
        }

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
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
        this.playerSpeed = 5;
        this.bulletSpeed = 7;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Fixed Array Bullet.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.my.sprite.grunt.y++;
        this.my.sprite.doublegrunt.y++;
        this.my.sprite.triplegrunt.y++;
        this.my.sprite.bomber.y++;

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
                        this.bulletCooldownCounter = this.bulletCooldown;
                
                        console.log(this.bulletCooldownCounter);
                        break;    // Exit the loop, so we only activate one bullet at a time
                    } else {
                        if (bullet.visible) {
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
        //make enemy collateral damage, player shield and death
        
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
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.grunt.x = Math.random()*config.width;
                    this.my.sprite.grunt.y = 40;
                    this.my.sprite.grunt.visible = true;
                }, this);
        
            } else if (this.collides(my.sprite.doublegrunt, gbullet)) {
                 
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
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.my.sprite.doublegrunt.x = Math.random()*config.width;
                        this.my.sprite.doublegrunt.y = 40;
                        this.my.sprite.doublegrunt.visible = true;
                    }, this);
                    
            } else if (this.collides(my.sprite.triplegrunt, gbullet)) {
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
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.my.sprite.triplegrunt.x = Math.random()*config.width;
                        this.my.sprite.triplegrunt.y = 40;
                        this.my.sprite.triplegrunt.visible = true;
                    }, this);
            
        } else if (this.collides(my.sprite.bomber, gbullet)) {
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
            my.sprite.bombergrunt.visible = false;
            my.sprite.bombergrunt.x = -100;
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.bombergrunt.x = Math.random()*config.width;
                this.my.sprite.bombergrunt.y = 40;
                this.my.sprite.bombergrunt.visible = true;
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
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
                }, this);
        
            } 
        }

        // Check for collateral collision with the double grunt
        for (let dbgbullet of my.sprite.doubleGruntBullet) {
            if (this.collides(my.sprite.doublegrunt, dbgbullet)) {
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
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.doublegrunt.x = Math.random()*config.width;
                    this.my.sprite.doublegrunt.y = 40;
                    this.my.sprite.doublegrunt.visible = true;
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
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.triplegrunt.x = Math.random()*config.width;
                    this.my.sprite.triplegrunt.y = 40;
                    this.my.sprite.triplegrunt.visible = true;
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
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.bomber.visible = true;
                    this.my.sprite.bomber.x = Math.random()*config.width;
                    this.my.sprite.bomber.y = 40;
                }, this);
        
            }
        }
        

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("groupBullet");
        }

        

    }

        // A center-radius AABB collision check
        collides(a, b) {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
        }
}
         