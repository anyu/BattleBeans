/********************************* Canvas/Screen Toggles *****************************/

var splash = document.getElementById('splashscreen');
var canvas = document.getElementById("game");
var credits_page = document.getElementById('credits');
var context = canvas.getContext("2d");

var play_button = document.getElementById('play-button');
var credits_button = document.getElementById('credits-button');

canvas.style.display = 'none';
credits_page.style.display = 'none';

// Menu buttons
play_button.onclick = function(){
    splash.style.display = 'none';
    canvas.style.display = 'block';
    initialize();
};

credits_button.onclick = function(){
    splash.style.display = 'none';
    credits_page.style.display = 'block'
};

// Credit page
credits_page.onclick = function() {
    splash.style.display = 'block';
    credits_page.style.display = 'none'

}

//Important for reset
var gameRunning = false;

function initialize() { 
    /********************************* GameOver Flag ******************************/
    var gameOver = false;
    var b1_hurtness = 0;
    var b2_hurtness = 0;

    //Important for reset
    gameRunning = true;

    /********************************* Define Game Objects ******************************/

    function Bean(x) {
        //bean properties
        this.x = x;
        this.y = 350;
        this.height = 75;
        this.width = 50;
        this.health = 3;
    }

    function Background() {
        //Background properties
        this.x = 0;
        this.y = 0;
        this.height = 450;
        this.width = 900;
    }

    function Bullet() {
        //bullet properties
        this.x = 0;
        this.y = 350;
        this.height = 25;
        this.width = 25;
        this.length = 0;
        this.centerX = 0;
        this.centerY = 400;
        this.radius = 0;
        this.speed = 1;
        this.angle = 180;

        //bullet flags
        this.power = false;
        this.fire = false;
    }

    function PowerBar(x, color) {
        this.x = x;
        this.y = 430;
        this.height = 0;
        this.width = 15;
        this.length = 0;
        this.color = color;
    }

    function Bean1Health(x, y) {
        this.x = x;
        this.y = y;
        this.ready = true;
    }

    function Bean2Health(x, y) {
        this.x = x;
        this.y = y;
        this.ready = true;
    }

    /********************************* Image Control Center ******************************/

    /*++++++++Landscape++++++++*/
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function() {
        bgReady = true;
    };
    bgImage.src = "images/landscape1.png";

    /*++++++++Beans++++++++*/
    var bean1Ready = false;
    var bean1Image = new Image();
    bean1Image.onload = function() {
        bean1Ready = true;
    };
    bean1Image.src = "images/bean1.png";

    var bean2Ready = false;
    var bean2Image = new Image();
    bean2Image.onload = function() {
        bean2Ready = true;
    };
    bean2Image.src = "images/bean2.png";

    /*++++++++Bullets++++++++*/
    var bulletReady = false;
    var bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    var ebulletReady = false;
    var ebulletImage = new Image();
    ebulletImage.src = "images/ebullet.png";

    /*++++++++Power Bar++++++++*/
    var powerBar = false;
    var epowerBar = false;

    /*++++++++Health++++++++*/
    var b1healthImage = new Image();
    b1healthImage.src = "images/b1health.png";

    var b2healthImage = new Image();
    b2healthImage.src = "images/b2health.png";

    /*++++++++Bean on Hit Images++++++++*/
    var b1hurtReady = false;
    var b1hurtImage = new Image();
    b1hurtImage.src = "images/bean1-hurt.png";

    var b2hurtReady = false;
    var b2hurtImage = new Image();
    b2hurtImage.src = "images/bean2-hurt.png";

    /********************************* Create initial Game Objects ******************************/

    /*++++++++Keyboard Inputs++++++++*/
    var pushed = {};
    var released = {};

    /*++++++++Images++++++++*/
    var bg = new Background();
    var bean1 = new Bean(Math.random() * 250 + 50);
    var bean2 = new Bean(Math.random() * 300 + 550);
    var bullet = new Bullet();
    var ebullet = new Bullet();
    var bar = new PowerBar(15, '#00CD00');
    var ebar = new PowerBar(875, '#CD0000');

    var b1health_1 = new Bean1Health(20, 20);
    var b1health_2 = new Bean1Health(70, 20);
    var b1health_3 = new Bean1Health(120, 20);

    var b2health_1 = new Bean2Health(700, 20);
    var b2health_2 = new Bean2Health(750, 20);
    var b2health_3 = new Bean2Health(800, 20);

    /********************************* Initial Bean2 Movement ******************************/
    var initial_bean2 = (Math.floor(Math.random() * 2));
    var counter = 0; //used later to determine number of times the update loop has completed
    if (initial_bean2 == 1) {
        var bean2_right = true;
    }
    if (initial_bean2 == 0) {
        var bean2_right = false;
    }

    /********************************* Handle Input ******************************/

    //Detect keyboard input
    addEventListener("keydown", function(e) {
        pushed[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function(e) {
        delete pushed[e.keyCode];
    }, false);

    addEventListener("keyup", function(e) {
        released[e.keyCode] = true;
    }, false);

    addEventListener("keydown", function(e) {
        delete released[e.keyCode];
    }, false);

    /********************************* Bullet reset ******************************/

    var resetBullet = function() {
            bulletReady = false;
            bullet.fire = false;
            bullet.x = bean1.x;
            bullet.length = 0;

            bullet.radius = 0;
            bullet.speed = 1;
            bullet.angle = 180;
        }

    var resetEBullet = function() {
            ebulletReady = false;
            ebullet.fire = false;
            ebullet.x = bean2.x;
            ebullet.y = 350;
            ebullet.length = 0;

            ebullet.radius = 0;
            ebullet.speed = 1;
            ebullet.angle = 180;
        }

        /********************************* Update Function ******************************/

    var update = function() {

            /*+++++++ Game State Controls +++++++++*/

            // if (80 in pushed) { // pause
      
            // }

            if (81 in pushed) { // quit
                endGame();
                splash.style.display = 'block';
                canvas.style.display = 'none';
            }

            /*+++++++ Bean 1 Controls +++++++++*/
            if (65 in pushed && bean1.x > 35) { // left
                bean1.x -= 3;
            }

            if (68 in pushed && bean1.x < 300) { // right
                bean1.x += 3;
            }

            if (32 in pushed && !bullet.fire) { // space
                bullet.power = true;
                bullet.fire = false;

                //set the initial position of the bullet
                bullet.x = bean1.x + 40;
                bullet.y = bean1.y + 20;
            }

            //Check for what keys are being released
            if (32 in released) {
                bullet.power = false;
                bullet.fire = true;
            }

            //Grow the power bar while holding down space
            if (bullet.power && bar.height > -400) {
                powerBar = true;
                bar.height -= 4;
                bar.length = -1 * bar.height;
                bullet.length = bar.length;
                bullet.centerX = (bullet.length + bean1.x);
                bullet.radius = bullet.centerX - bean1.x;
            }

            if (bullet.fire) {
                //Collapse the power bar
                powerBar = false;
                bar.height = 0;
                bar.length = 0;
                bulletReady = true;

                // Compute the triangle coordinates from the center of rotation
                if (bullet.y < 401) {
                    bullet.x = bullet.centerX + Math.cos(bullet.angle) * bullet.radius;
                    bullet.y = bullet.centerY + Math.sin(bullet.angle) * bullet.radius;
                    bullet.angle += bullet.speed / 40;
                }

                // stop bullet if it hits Bean2
                else if (bullet.x + 25 >= (bean2.x) && bullet.x <= (bean2.x + 50) && bullet.y + 25 >= (bean2.y) && bullet.y <= (bullet.y + 75)) {
                    resetBullet();

                    b2hurtReady = true;
                    bean2Ready= false;

                    if (b2health_1.ready) {
                        b2health_1.ready = false;
                    } else if (b2health_2.ready) {
                        b2health_2.ready = false;
                    } else {
                        b2health_3.ready = false;
                        bean2Ready = false;
                        gameOver = true;
                    }
                }

                // stop bullet if it hits the ground
                else if (bullet.y >= 401) {
                    resetBullet();
                }
            }

            /*+++++++ Bean 2 Controls +++++++++*/

            //Movement: 
            counter++;
            var random_frame = (Math.floor(Math.random() * 50)) + 50 //random btwn 50-100
            if (counter > random_frame) {
                var random = (Math.floor(Math.random() * 100)); //random between 0 - 99
                //flip the direction 2% of the time
                if (random >= 98) {
                    bean2_right = !bean2_right;
                    counter = 0; //reset counter after successful direction change
                }
            }

            if (bean2_right && bean2.x < 800) {
                bean2.x += 2;
            } else if (!bean2_right && bean2.x > 550) {
                bean2.x -= 2;
            }

            //Shooting:
            //this loop controls when the enemy bean starts powering up
            if (counter > 90 && !ebullet.fire) { //10% of the time it will start powering up
                ebullet.power = true;
                var rand_power = (Math.floor(Math.random() * 450)) + 150; //Generates random between 150-600
            }

            //this loop controls the growth of the power bar for the enemy bean
            if (ebullet.power && !ebullet.fire && ebar.height > -400) {
                epowerBar = true;
                ebar.height -= 2;
                ebar.length = -1 * ebar.height;
                ebullet.length = ebar.length; //store the power
                ebullet.centerX = bean2.x - ebullet.length;
                ebullet.radius = bean2.x - ebullet.centerX;
            }

            //this loop controls when the enemy bean decides to fire his bullet
            if (ebullet.power) {
                var rand_fire = (Math.floor(Math.random() * 100000)); //Generates random between 0-100,000
                if (ebullet.length > rand_power) { //0.55% of the time switch bullet to fire mode
                    ebullet.fire = true;
                    ebullet.power = false;
                    ebullet.x = bean2.x;
                    ebulletReady = true;
                }
            }

            //this loop controls the shot
            if (!ebullet.power && ebullet.fire) {
                //collapse the power bar
                epowerBar = false;
                ebar.height = 0;
                ebar.length = 0;
                // Compute the triangle coordinates from the center of rotation
                if (ebullet.y < 401) {
                    ebullet.x = ebullet.centerX + -1 * Math.cos(ebullet.angle) * ebullet.radius;
                    ebullet.y = ebullet.centerY + Math.sin(ebullet.angle) * ebullet.radius;
                    ebullet.angle += ebullet.speed / 60;
                }

                // stop bullet if it hits Bean1
                else if (ebullet.x + 25 >= (bean1.x) && ebullet.x <= (bean1.x + 50) && ebullet.y - 25 >= (bean2.y) && ebullet.y <= (bullet.y + 75)) {
                    resetEBullet();

                    b1hurtReady = true;
                    bean1Ready= false;

                    if (b1health_3.ready) {
                        b1health_3.ready = false;
                    } else if (b1health_2.ready) {
                        b1health_2.ready = false;
                    } else {
                        b1health_1.ready = false;
                        bean1Ready = false;
                        gameOver = true;
                    }
                }

                //stop bullet if it hits the ground
                else if (ebullet.y >= 401) {
                    resetEBullet();
                }
            }

        }

        /********************************* Redraw Game Objects ******************************/
    var draw = function() {
            if (bgReady) {
                context.drawImage(bgImage, bg.x, bg.y);
            }
            if (bean1Ready) {
                context.drawImage(bean1Image, bean1.x, bean1.y);
            }

            if (bean2Ready) {
                context.drawImage(bean2Image, bean2.x, bean2.y);
            }
            if (bulletReady) {
                context.drawImage(bulletImage, bullet.x, bullet.y);
            }
            if (ebulletReady) {
                context.drawImage(ebulletImage, ebullet.x, ebullet.y);
            }

            if (b1hurtReady) {
                context.drawImage(b1hurtImage, bean1.x, bean1.y);
                if (b1_hurtness > 100) {
                    b1hurtReady = false;
                    bean1Ready = true; 
                    b1_hurtness = 0;
                }
                b1_hurtness++;
            }

             if (b2hurtReady) {
                context.drawImage(b2hurtImage, bean2.x, bean2.y);
                if (b2_hurtness > 100) {
                    b2hurtReady = false;
                    bean2Ready = true; 
                    b2_hurtness = 0;
                }
                b2_hurtness++;
            }

            if (powerBar) {
                context.beginPath();
                context.rect(bar.x, bar.y, bar.width, bar.height);
                context.fillStyle = bar.color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = "black";
                context.stroke();
            }

            if (epowerBar) {
                context.beginPath();
                context.rect(ebar.x, ebar.y, ebar.width, ebar.height);
                context.fillStyle = ebar.color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = "black";
                context.stroke();
            }

            if (gameOver) {
                endGame();
            }

            if (b1health_1.ready) {
                context.drawImage(b1healthImage, b1health_1.x, b1health_1.y);
            }
            if (b1health_2.ready) {
                context.drawImage(b1healthImage, b1health_2.x, b1health_2.y);
            }
            if (b1health_3.ready) {
                context.drawImage(b1healthImage, b1health_3.x, b1health_3.y);
            }
            if (b2health_1.ready) {
                context.drawImage(b2healthImage, b2health_1.x, b2health_1.y);
            }
            if (b2health_2.ready) {
                context.drawImage(b2healthImage, b2health_2.x, b2health_2.y);
            }
            if (b2health_3.ready) {
                context.drawImage(b2healthImage, b2health_3.x, b2health_3.y);
            }

        }

        /********************************* End Game ******************************/

    function endGame() {
        gameRunning = false;
        clearInterval(gameLoop);
        bgReady = false;
        bean1Ready = false;
        bean2Ready = false;
        bulletReady = false;
        ebulletReady = false;

        context.fill();
        if (!b1health_1.ready) {
            context.fillStyle = 'black';
            context.font = "25pt Bowlby One SC";
            context.fillText("Awwwww, you dead.", 300, 225);
            context.fillText("R to restart", 350, 300);

        }
        if (!b2health_3.ready) {
            context.fillStyle = 'black';
            context.font = "25pt Bowlby One SC";
            context.fillText("Viiiiicccctorrrryyyyyyy!!!!", 250, 225);
            context.fillText("R to restart", 350, 300);
        }
    }


    /********************************* Main Game Loop ******************************/

    var game = function() {
            update();
            draw();
        }

    function newGame() {
        gameLoop = setInterval(game, 1);
    }

    newGame();

}

document.onkeydown = onkeydownhandler;

function onkeydownhandler(e) {
    if (!gameRunning && e.keyCode == 82) {
        initialize();
    }
}
