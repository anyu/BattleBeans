
/********************************* Code Premise ***************************************

Two main components: code outside initialize() and code inside initialize(). 
The outside code controls everything that happens outside of game play: the menu, 
handling R to restart game, establshing global variables (eg.sound effects) 

Once ‘Play Game’ is clicked, initialize() is called and the game loop starts. The 
game runs by calling two functions over and over: update() and draw(). 

When the health life of one bean gets to 0, update() calls endGame() and exits the loop. 

***************************************************************************************/


/********************************* Sound Effect Variables *****************************/

var themeMusic = new Audio("sounds/alt_theme.ogg");  // game music
var ouch = new Audio("sounds/ouch.mp3");             // bean hurt sound
var win = new Audio("sounds/win.wav");               // player wins game
var loss = new Audio("sounds/loss.mp3");             // player loses game

/******************************** Canvas/Screen Toggles *******************************/

var splash = document.getElementById('splashscreen');
var canvas = document.getElementById("game");
var credits_page = document.getElementById('credits');
var context = canvas.getContext("2d");

var play_button = document.getElementById('play-button');
var credits_button = document.getElementById('credits-button');

// Hide canvas and credits initially
canvas.style.display = 'none';
credits_page.style.display = 'none';

// Menu buttons 
play_button.onclick = function() {
    splash.style.display = 'none';
    canvas.style.display = 'block';
    initialize(); // triggers game start
};

credits_button.onclick = function() {
    splash.style.display = 'none';
    credits_page.style.display = 'block'
};

// Credit page
credits_page.onclick = function() {
    splash.style.display = 'block';
    credits_page.style.display = 'none'
}

// Game state boolean - used for reset
var gameRunning = false;

function initialize() {    /********************************* Global Flags ******************************/
    var gameOver = false;
    var b1_hurtness = 0;
    var b2_hurtness = 0;

    gameRunning = true;

    /********************************* Define Game Objects ******************************/

    // Bean player object
    function Bean(x) {
        this.x = x;
        this.y = 350;
        this.height = 75;
        this.width = 50;
        this.health = 3;
    }

    // Game landscape object
    function Background() {
        this.x = 0;
        this.y = 0;
        this.height = 450;
        this.width = 900;
    }

    // Bullet object
    function Bullet() {
        this.x = 0;
        this.y = 350;
        this.height = 25;
        this.width = 25;
        this.length = 0;

        // Used for arc path calculations
        this.centerX = 0;
        this.centerY = 400;
        this.radius = 0;
        this.speed = 1;
        this.angle = 180;

        // Bullet state flags
        this.power = false;
        this.fire = false;
    }

    // Powerbar object
    function PowerBar(x, color) {
        this.x = x;
        this.y = 420;
        this.height = 0;
        this.width = 15;
        this.length = 0;
        this.color = color;
    }

    // Bean 1 life object
    function Bean1Health(x, y) {
        this.x = x;
        this.y = y;
        this.ready = true;
    }

    // Bean 2 life object
    function Bean2Health(x, y) {
        this.x = x;
        this.y = y;
        this.ready = true;
    }

    /********************************* Image Control Center ******************************/

    /*++++++++ Load landscape ++++++++*/
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function() {
        bgReady = true;
    };
    bgImage.src = "images/landscape1.png";

    /*++++++++ Load beans ++++++++*/
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

    /*++++++++ Load bullets ++++++++*/
    var bulletReady = false;
    var bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    var ebulletReady = false;
    var ebulletImage = new Image();
    ebulletImage.src = "images/ebullet.png";

    /*++++++++ Load powerbar ++++++++*/
    var powerBar = false;
    var epowerBar = false;

    /*++++++++ Health/Life ++++++++*/
    var b1healthImage = new Image();
    b1healthImage.src = "images/b1health.png";

    var b2healthImage = new Image();
    b2healthImage.src = "images/b2health.png";

    /*++++++++ Load bean on hit expressions ++++++++*/
    var b1hurtReady = false;
    var b1hurtImage = new Image();
    b1hurtImage.src = "images/bean1-hurt.png";

    var b2hurtReady = false;
    var b2hurtImage = new Image();
    b2hurtImage.src = "images/bean2-hurt.png";


    /***************************** Create Initial Game Objects *******************************/

    /*++++++++ Keyboard Input Objects ++++++++*/
    var pushed = {};
    var released = {};

    /*++++++++ All Objects ++++++++*/
    var bg = new Background();
    var bean1 = new Bean(Math.random() * 250 + 50);
    var bean2 = new Bean(Math.random() * 300 + 550);
    var bullet = new Bullet();
    var ebullet = new Bullet();
    var bar = new PowerBar(15, '#00FF00');
    var ebar = new PowerBar(870, '#CD0000');

    // Bean1 lives positioned in top left corner
    var b1health_1 = new Bean1Health(45, 20);
    var b1health_2 = new Bean1Health(90, 20);
    var b1health_3 = new Bean1Health(135, 20);

    // Bean2 lives positioned in top right corner
    var b2health_1 = new Bean2Health(720, 20);
    var b2health_2 = new Bean2Health(765, 20);
    var b2health_3 = new Bean2Health(810, 20);

    /************************** Randomize Initial Bean2 Movement ******************************/
    var initial_bean2 = (Math.floor(Math.random() * 2));
    var counter = 0;  // Used later to determine number of times the update loop has completed
    if (initial_bean2 == 1) {
        var bean2_right = true;
    }
    if (initial_bean2 == 0) {
        var bean2_right = false;
    }

    /********************************* Keyboard Event Listeners ******************************/

    // Detect keyboard input; stores pressed and released keys in pushed/release objects
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

    /********************************* Bullet Reset *****************************************/

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

    /********************************* Update Function ************************************

    Called continuously when game is running. Checks for player input, changes the positions 
    of the characters, calculates bullet trajectories, keeps track of health points, and 
    checks for impact between bullets and beans. 

    ***************************************************************************************/

    var update = function() {

            /*+++++++ Game State Controls +++++++++*/

            if (81 in pushed) {        // Q to quit, bring back splashscreen
                endGame();
                splash.style.display = 'block';
                canvas.style.display = 'none';
            }

            /*+++++++ Bean 1 Controls +++++++++*/
            if (65 in pushed && bean1.x > 35) {     // A moves left, can't go too far left
                bean1.x -= 3;
            }

            if (68 in pushed && bean1.x < 300) {    // D moves right, can't go too far right
                bean1.x += 3;
            }

            if (32 in pushed && !bullet.fire) {    // When spacebar is pressed, change bullet states
                bullet.power = true;
                bullet.fire = false;

                // Set the initial position of the bullet
                bullet.x = bean1.x + 40;
                bullet.y = bean1.y + 20;
            }

            // When spacebar is release, change bullet states
            if (32 in released) {
                bullet.power = false;
                bullet.fire = true;
            }

            // Increase the powerbar while spacebar is held down
            if (bullet.power && bar.height > -400) {
                powerBar = true;
                bar.height -= 4;
                bar.length = -1 * bar.height;
                bullet.length = bar.length;
                bullet.centerX = (bullet.length + bean1.x);
                bullet.radius = bullet.centerX - bean1.x;
            }

            if (bullet.fire) {
                // Collapse the power bar
                powerBar = false;
                bar.height = 0;
                bar.length = 0;
                bulletReady = true;

                // Control bullet arc path with sine and cosine functions
                if (bullet.y < 401) {
                    bullet.x = bullet.centerX + Math.cos(bullet.angle) * bullet.radius; // centerX is the X-coordinate of halfway point between final shot length and current bean position
                    bullet.y = bullet.centerY + Math.sin(bullet.angle) * bullet.radius; // radius is the actual distance between the halfway point and bean's current position
                    bullet.angle += bullet.speed / 40; // angle changes from 0 to 180
                }

                // Stop bullet if it hits Bean2
                else if (bullet.x + 25 >= (bean2.x) && bullet.x <= (bean2.x + 50) && bullet.y + 25 >= (bean2.y) && bullet.y <= (bullet.y + 75)) {
                    ouch.play();
                    resetBullet();

                    b2hurtReady = true;
                    bean2Ready = false;

                    // Decrement a life on hit
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

                // Stop bullet if it hits the ground
                else if (bullet.y >= 401) {
                    resetBullet();
                }
            }

            /*+++++++ Bean 2 Controls +++++++++*/

            // Movement: 
            counter++;
            var random_frame = (Math.floor(Math.random() * 50)) + 50 // random number betwen 50-100
            if (counter > random_frame) {
                var random = (Math.floor(Math.random() * 100)); // random number between 0 - 99
                // Flip the direction 2% of the time
                if (random >= 98) {
                    bean2_right = !bean2_right;
                    counter = 0; // reset counter after successful direction change
                }
            }

            if (bean2_right && bean2.x < 800) {
                bean2.x += 2;
            } else if (!bean2_right && bean2.x > 550) {
                bean2.x -= 2;
            }

            // Shooting:
            // Controls when the enemy bean starts powering up
            if (counter > 90 && !ebullet.fire) { // 10% of the time it will start powering up
                ebullet.power = true;
                var rand_power = (Math.floor(Math.random() * 450)) + 150; // random number between 150-600
            }

            // Controls the growth of the powerbar for the enemy bean
            if (ebullet.power && !ebullet.fire && ebar.height > -400) {
                epowerBar = true;
                ebar.height -= 2;
                ebar.length = -1 * ebar.height;
                ebullet.length = ebar.length; //store the power
                ebullet.centerX = bean2.x - ebullet.length;
                ebullet.radius = bean2.x - ebullet.centerX; 
            }

            // Controls when the enemy bean decides to fire the bullet
            if (ebullet.power) {
                var rand_fire = (Math.floor(Math.random() * 100000)); // random number between 0-100000
                if (ebullet.length > rand_power) { // 0.55% of the time switch bullet to fire mode
                    ebullet.fire = true;
                    ebullet.power = false;
                    ebullet.x = bean2.x;
                    ebulletReady = true;
                }
            }

            // controls the shot
            if (!ebullet.power && ebullet.fire) {
                // Collapse the powerbar
                epowerBar = false;
                ebar.height = 0;
                ebar.length = 0;
                // Control bullet arc path with sine and cosine functions
                if (ebullet.y < 401) {
                    ebullet.x = ebullet.centerX + -1 * Math.cos(ebullet.angle) * ebullet.radius; // centerX is the X-coordinate of halfway point between final shot length and current bean position
                    ebullet.y = ebullet.centerY + Math.sin(ebullet.angle) * ebullet.radius; // radius is the actual distance between the halfway point and bean's current position
                    ebullet.angle += ebullet.speed / 60;  // angle changes from 0 to 180
                }

                // Stop bullet if it hits Bean1
                else if ((ebullet.x <= bean1.x + 50) && (ebullet.x + 25 >= bean1.x) && (ebullet.y + 25 >= bean1.y)) {
                    ouch.play();
                    bulletReady = false;
                    resetEBullet();
                    b1hurtReady = true;
                    bean1Ready = false;

                    // Decrement a life on hit
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

                // Stop bullet if it hits the ground
                else if (ebullet.y >= 401) {
                    resetEBullet();
                }
            }

        }

    /********************************* Draw Function **************************************

    Called continuously when game is running. Redraws everything on top of current layer

    ***************************************************************************************/

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

            // If a bean is hit, show the hurt expression image for ~1 second
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

            // Draw player's powerbar
            if (powerBar) {
                context.beginPath();
                context.rect(bar.x, bar.y, bar.width, bar.height);
                context.fillStyle = bar.color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = "black";
                context.stroke();
            }

            // Draw computer's powerbar
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

            // Draw the bean lives
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

    /********************************* End Game Function *****************************************

    Exits game loop, clears all variable flags, displays end game text, plays corresponding sound

    **********************************************************************************************/

    function endGame() {
        themeMusic.pause();
        gameRunning = false;
        clearInterval(gameLoop);
        bgReady = false;
        bean1Ready = false;
        bean2Ready = false;
        bulletReady = false;
        ebulletReady = false;

        context.fill();

        // If Bean1 doesn't have any more lives, Bean1 loses. Display text.
        if (!b1health_1.ready) {
            loss.currentTime = 0;
            loss.play();
            context.fillStyle = 'black';
            context.font = "25pt Bowlby One SC";
            context.fillText("Awwww, you dead.", 300, 200);
            context.fillText("[ R ] to restart", 330, 260);

        }

        // If Bean2 doesn't have any more lives, Bean2 loses. Display text.
        if (!b2health_3.ready) {
            win.currentTime = 0;
            win.play();
            context.fillStyle = 'black';
            context.font = "25pt Bowlby One SC";
            context.fillText("Epic Win. You da bean!", 260, 200);
            context.fillText("[ R ] to restart", 330, 260);
        }
    }

   /********************************* Main Game Loop **************************************

    Starts a new game by starting the game loop. Calls update() and draw() continuously.

    ***************************************************************************************/
    var game = function() {
            update();
            draw();
        }

    // Starts game loop, game music
    function newGame() {
        gameLoop = setInterval(game, 1);
        themeMusic.currentTime = 0;
        themeMusic.loop = true;
        themeMusic.play();
        loss.pause();
        win.pause();
    }

    newGame();
}

document.onkeydown = onkeydownhandler;


// Checks if R has been pressed at end of game
function onkeydownhandler(e) {
    if (!gameRunning && e.keyCode == 82) {    // R to restart game
        initialize();
    }

}
