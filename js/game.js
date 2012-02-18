// Create the canvas
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 450;
document.body.appendChild(canvas);

/********************************* Object Images ******************************/

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/landscape.jpg";

// Bean 1 image
var bean1Ready = false;
var bean1Image = new Image();
bean1Image.onload = function () {
    bean1Ready = true;
};
bean1Image.src = "images/bean1.png";

// Bean 2 image
var bean2Ready = false;
var bean2Image = new Image();
bean2Image.onload = function () {
    bean2Ready = true;
};
bean2Image.src = "images/bean2.png";

// Bullet image
var bulletReady = false;
var bulletImage = new Image();
//bulletImage.onload = function () {
//    bulletReady = true;
//};
bulletImage.src = "images/bullet.png";


/********************************* Object Attributes ******************************/
var bean1 = {
    speed: 256 // movement in pixels per second
};
var bean2 = {
    speed: 256 // movement in pixels per second
};

var bullet = {
    speed: 256 // movement in pixels per second
};

//create the aiming arc
var aim_arc = function (){
    
}

// Reset game
var reset = function () {
    bean1.x = (Math.floor(Math.random()*601))/2;
    bean1.y = 350;
    bean2.x = 700;
    bean2.y = 350;
    bullet.x = bean1.x;
    bullet.y = 350;
};

// Initial bean2 movement
var initial_bean2 = (Math.floor(Math.random()*2));
var counter = 0; //used to determine number of times the loop has completed
var shot_length = 0;

if(initial_bean2 == 1){
    var bean2_right = true;
}
if(initial_bean2 == 0){
    var bean2_left = false;
}

/********************************* Handle Keyboard Inputs ******************************/
var keysDown = {};
var keysUp = {};
var spacebar_pressed = false;

//arguments: the event type, the function to be executed, and useCapture boolean 
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

addEventListener("keyup", function (e) {
    keysUp[e.keyCode] = true;
}, false);

addEventListener("keydown", function (e) {
    delete keysUp[e.keyCode];
}, false);

// Keyboard Input
var update = function (e) {

    bulletReady = false;

    if (65 in keysDown) { // Player1 holding A
        bean1.x -= bean1.speed * e;
        bullet.x = bean1.x;
        spacebar_pressed = false;
    }

    if (68 in keysDown) { // Player1 holding D
        bean1.x += bean1.speed * e;
        bullet.x = bean1.x;
        spacebar_pressed = false;
    }
    
    if (32 in keysDown) { // Player1 holding Spacebar
        shot_length += 5;
        spacebar_pressed = true;
    }

    /************************************
      Problems: 1) bullet stops if spacebar is pressed again while bullet is in flight
                --need to prevent anything from happening while bullet is still moving 
    
    ************************************/
    
    if(32 in keysUp) {       
        if(spacebar_pressed) {        
            bulletReady = true;       
            if (bullet.x >= shot_length){
                bullet.x = bean1.x;  
                shot_length = 0;    
                bulletReady = false;
                spacebar = false;          
            }     
        }
   } 

   if (bulletReady){
        bullet.x += 3;
    }    
      
    // *********************************************
    //     Saving this for possibility of two player game    
    //    if (37 in keysDown) { // Player2 holding left
    //        bean2.x -= bean2.speed * e;
    //    }
    //    if (39 in keysDown) { // Player2 holding right
    //        bean2.x += bean2.speed * e;
    //    }
    //***********************************************

    //stop bean from going past midpoint 
    bean1.x = bean1.x.stopPoint(0, (canvas.width/2) - 50);
    bean2.x = bean2.x.stopPoint((canvas.width/2)+50, canvas.width - 55);
       
    //loop only allows direction change after a 100 frames
    counter ++;
    var random_frame = (Math.floor(Math.random()*50))+50 //generates random btwn 50-100
    if(counter > random_frame){
        var random = (Math.floor(Math.random()*100)); //Generates random between 0 - 99
        //flip the direction 2% of the time
        if(random >= 98){ 
            bean2_right = !bean2_right;
            counter = 0; //reset counter after successful direction change
        }

    }
    
    if(bean2_right){
        bean2.x += bean2.speed * e;
    }
    else{
        bean2.x -= bean2.speed * e;
    } 

};

// Stop beans from going off canvas or past middle
Number.prototype.stopPoint = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/********************************* Draw Everything ******************************/
var render = function () {
    if (bgReady) {
        context.drawImage(bgImage, 0, 0);
    }

    if (bean1Ready) {
        context.drawImage(bean1Image, bean1.x, bean1.y);
    }
	
    if (bean2Ready) {
        context.drawImage(bean2Image, bean2.x, bean2.y);
    }
    
    if (bulletReady)  {
        context.drawImage(bulletImage, bullet.x, bullet.y);
    }
    
//***********************************  
//This didn't work either :/
//***********************************    
//    if (aim_arcReady) {
//        context.arc(bean1.x, bean1.y, ((bean1.x/bean2.x)/2), math.pi, (2*math.pi), false);
//        context.lineWidth = 2;
//        context.strokeStyle = "#000"; // line color = black
//        context.stroke();
//    }
//************************************



};

/********************************* Main Game Loop ******************************/
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Start game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
