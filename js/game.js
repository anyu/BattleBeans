/********************************* Identify Canvas *****************************/

var splash = document.getElementById('splashscreen');
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

//Hide canvas until splashscreen is clicked
canvas.style.display='none';
splash.onclick = function() {
    splash.style.display='none';
    canvas.style.display='block';
    newGame();
};

/********************************* Define Game Objects ******************************/

function Bean(x){
    //bean properties
    this.x = x;
    this.y = 350;
    this.height = 30;
    this.width = 20;
}

function Background(){
    //Background properties
    this.x = 0;
    this.y = 0;
    this.height = 450;
    this.width = 900;
}

function Bullet(x){
    //bullet properties
    this.x = 0;
    this.y = 350;
    this.height = 30;
    this.width = 20;
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

function PowerBar(x, color){
    this.x = x;
    this.y = 430;
    this.height = 0;
    this.width = 15;
    this.length = 0;
    this.color = color;
}

/********************************* Image Control Center ******************************/

var gameOver = false;

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/landscape1.jpg";

var bean1Ready = false;
var bean1Image = new Image();
bean1Image.onload = function () {
    bean1Ready = true;
};
bean1Image.src = "images/bean1.png";

var bean2Ready = false;
var bean2Image = new Image();
bean2Image.onload = function () {
    bean2Ready = true;
};
bean2Image.src = "images/bean2.png";

var bulletReady = false;
var bulletImage = new Image();
bulletImage.src = "images/bullet.png";

var ebulletReady = false;
var ebulletImage = new Image();
ebulletImage.src = "images/ebullet.png";


var powerBar = false;
var epowerBar = false;

/********************************* Create initial Game Objects ******************************/

var pushed = {};
var released = {};

var bg = new Background(); //loads background
var bean1 = new Bean(Math.random()*300+50); //loads bean1 (random from 50 to 350)
var bean2 = new Bean(Math.random()*300+550); //loads bean2 (random from 550 to 850)
var bullet = new Bullet(); // Creates Player's Bullet
var ebullet = new Bullet(); //Creates Enemy's Bullet
var bar = new PowerBar(15, '#00CD00');
var ebar = new PowerBar(875, '#CD0000');

/*+++++++++Initial bean2 movement+++++++++*/
var initial_bean2 = (Math.floor(Math.random()*2));
var counter = 0; //used to determine number of times the loop has completed

if(initial_bean2 == 1) {
    var bean2_right = true;
}
if(initial_bean2 == 0) {
    var bean2_right = false;
}

/********************************* Control Input ******************************/

//Detect mouse click + position on click
// addEventListener("mousedown", getPosition, false);

function getPosition(e) {
    var mousePosX = e.x;
    var mousePosY = e.y;

    mousePosX -= canvas.offsetLeft;
    mousePosY -= canvas.offsetTop;

    // if ((mousePosX  >= 505 && mousePosY >= 222) && (mousePosX <= 724 && mousePosY >= 221) &&
    //     (mousePosX >= 505 && mousePosY <= 262) && (mousePosX <= 724 && mousePosY <= 262) {
    //     alert("x:" + mousePosX + " y:" + mousePosY);   
    // }

}

var init = function() {
    //Detect keyboard input
    addEventListener("keydown", function (e) {
        pushed[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete pushed[e.keyCode];
    }, false);

    addEventListener("keyup", function (e) {
        released[e.keyCode] = true;
    }, false);

    addEventListener("keydown", function (e) {
        delete released[e.keyCode];
    }, false);

    // addEventListener("click", function (e) {
    //     delete released[e.keyCode];
    // }, false);
}

/********************************* Bullet reset ******************************/

var resetBullet = function(){
    bulletReady = false;
    eBulletReady = false;
    bullet.fire = false;
    bullet.x = bean1.x;
    bullet.length = 0;

    bullet.radius = 0;
    bullet.speed = 1;
    bullet.angle = 180;
}

var resetEBullet = function(){
    bulletReady = false;
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

var update = function(){

    /*+++++++ Bean 1 Controls +++++++++*/
    //Check for what keys are being pressed

    if (81 in pushed) { // Q to quit game
        endGame();
        resetGame();
        splash.style.display='block';
        canvas.style.display='none';
    }

    // if (80 in pushed) { // P to pause game
    //     clearInterval(gameLoop);
    // }

    if (65 in pushed && bean1.x > 35) { // Player holding left
        bean1.x -= 3;
    }

    if (68 in pushed && bean1.x < 300) { // Player holding right
        bean1.x += 3;
    }

    if (32 in pushed && !bullet.fire) { //Player holding space
        // var bullet = new Bullet ();
        bullet.power = true;
        bullet.fire = false;

        //set the initial position of the bullet
        bullet.x = bean1.x + 40;
        bullet.y = bean1.y + 20;
    }
    
    //Check for what keys are being released
    if (32 in released) { //Player released space
        bullet.power = false;
        bullet.fire = true;
    }
    
    //Grow the power bar while holding down space
    if(bullet.power && bar.height > -400){
        powerBar = true;
        bar.height -= 4;
        bar.length = -1*bar.height;
        bullet.length = bar.length; //store the power
        bullet.centerX = (bullet.length + bean1.x);
        bullet.radius = bullet.centerX - bean1.x;
    }

    if(bullet.fire){
        //Collapse the power bar
        powerBar = false;
        bar.height = 0;
        bar.length = 0;
        bulletReady = true;
        // Compute the triangle coordinates from the center of rotation
        if(bullet.y < 401){
            bullet.x = bullet.centerX + Math.cos(bullet.angle) * bullet.radius;
            bullet.y = bullet.centerY + Math.sin(bullet.angle) * bullet.radius;
            bullet.angle += bullet.speed/40;
        }

        // stop bullet if it hits Bean2
        else if (bullet.x+25 >= (bean2.x) && bullet.x <= (bean2.x+50) &&
            bullet.y+25 >= (bean2.y) && bullet.y <= (bullet.y+75)) {            
            bean2Ready = false;
            resetBullet();
            gameOver = true;
        }

        // stop bullet if it hits the ground
        else if(bullet.y >= 401) {
            resetBullet();       
        }
    }
    
    /*+++++++ Bean 2 Controls +++++++++*/
    
    //Movement: 

    counter ++;
    var random_frame = (Math.floor(Math.random() * 50)) + 50 //generates random btwn 50-100
    if(counter > random_frame){
        var random = (Math.floor(Math.random() * 100)); //Generates random between 0 - 99
        //flip the direction 2% of the time
        if(random >= 98){
            bean2_right =! bean2_right;
            counter = 0; //reset counter after successful direction change
        }
    }

    if(bean2_right && bean2.x < 800){
        bean2.x += 2;
    }
    else if (!bean2_right && bean2.x > 550){
        bean2.x -= 2;
    }

    //Shooting:

    //this loop controls when the enemy bean start powering up
    if(counter > 90 && !ebullet.fire){ //10% of the time it will start powering up
        ebullet.power = true;
        var rand_power = (Math.floor(Math.random() * 450)) + 150; //Generates random between 150-600
    }

    //this loop controls the growth of the power bar for the enemy bean
    if(ebullet.power && !ebullet.fire && ebar.height >-400){
        epowerBar = true;
        ebar.height -= 2;
        ebar.length = -1*ebar.height;
        ebullet.length = ebar.length; //store the power
        ebullet.centerX = bean2.x - ebullet.length;
        ebullet.radius = bean2.x - ebullet.centerX;
    }

    //this loop controls when the enemy bean decides to fire his bullet
    if(ebullet.power){
        var rand_fire = (Math.floor(Math.random() * 100000)); //Generates random between 0-100,000
        if(ebullet.length > rand_power){ //0.55% of the time switch bullet to fire mode
            ebullet.fire=true;
            ebullet.power=false;
            ebullet.x = bean2.x;
            ebulletReady = true;
        }
    }

    //this loop controls the shot
    if(!ebullet.power && ebullet.fire){
        //collapse the power bar
        epowerBar = false;
        ebar.height = 0;
        ebar.length = 0;
        // Compute the triangle coordinates from the center of rotation
        if(ebullet.y < 401){
            ebullet.x = ebullet.centerX + -1*Math.cos(ebullet.angle) * ebullet.radius;
            ebullet.y = ebullet.centerY + Math.sin(ebullet.angle) * ebullet.radius;
            ebullet.angle += ebullet.speed/60;
        }

        // stop bullet if it hits Bean2
        else if (ebullet.x+25 >= (bean1.x) && ebullet.x <= (bean1.x+50) &&
            bullet.y+25 >= (bean2.y) && bullet.y <= (bullet.y+75)) {            
            bean1Ready = false;
            resetEBullet();
            gameOver = true;
        }

        //stop bullet if it hits the ground
        else if(ebullet.y >= 401) {
            resetEBullet();    
        }
    }


}

/********************************* Redraw Game Objects ******************************/

var draw = function(){
    if(bgReady){
        context.drawImage(bgImage, bg.x, bg.y);
    }
    if (bean1Ready) {
        context.drawImage(bean1Image, bean1.x, bean1.y);
    }

    if (bean2Ready) {
        context.drawImage(bean2Image, bean2.x, bean2.y);
    }
    if(bulletReady){
        context.drawImage(bulletImage, bullet.x, bullet.y);
    }
    if(ebulletReady){
        context.drawImage(ebulletImage, ebullet.x, ebullet.y);
    }
    if(powerBar){
        context.beginPath();
        context.rect(bar.x, bar.y, bar.width, bar.height);
        context.fillStyle = bar.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
    }

    if(epowerBar){
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
}

/********************************* End game ******************************/

var endGame = function() {
    context.fillStyle = "black";
    context.font = "45pt Bowlby One SC";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("GAME OVER", canvas.width/2, canvas.height/3);
    context.font = "20pt Bowlby One SC";
    context.fillText("Click anywhere to play again!", canvas.width/2, canvas.height/2);

    clearInterval(gameLoop);

    canvas.onclick = function() {
        resetGame();
    };
}

function resetGame() {
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(bgImage, bg.x, bg.y);
    context.drawImage(bean1Image, bean1.x, bean1.y);
    context.drawImage(bean2Image, bean2.x, bean2.y);
    bean1Ready = true;
    bean2Ready = true;
    powerBar = false;
    gameOver = false;
    newGame();
}

/********************************* Main Game Loop ******************************/

var main = function(){
    update();
    draw();
}

var newGame = function() {
    init();
    gameLoop = setInterval(main, 1); 
}

