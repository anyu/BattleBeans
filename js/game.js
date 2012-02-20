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
bulletImage.src = "images/bullet.png";


// Crosshair image
var crosshairReady = false;
var crosshairImage = new Image();
crosshairImage.src = "images/crosshair.png";

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

var crosshair = {
    speed: 20 // movement in pixels per second
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
    crosshair.x = bean1.x;
    crosshair.y = 350;
};

// Initial bean2 movement
var initial_bean2 = (Math.floor(Math.random()*2));
var counter = 0; //used to determine number of times the loop has completed

if(initial_bean2 == 1){
    var bean2_right = true;
}
if(initial_bean2 == 0){
    var bean2_left = false;
}

/********************************* Handle Keyboard Inputs ******************************/
var left = false;
var right = false;
var fire = false;
var power = false;
var shot = false;
var shot_length = bean1.x;

document.onkeydown = onKeyDown;  
document.onkeyup   = onKeyUp;  

function onKeyDown(e) {  
    if(!e){
        var e = window.event;
    }  
  
    switch(e.keyCode) {  
        // left  
        case 65:
            left = true;
            right = false;  
            break;  
        // right  
        case 68:
            right = true;
            left = false;  
            break; 
        // Space Bar for power
        case 32:
            if(fire != true){ //Idea: can't press space again while bullet in flight
                power = true;
                crosshair.x = bean1.x;
                crosshairReady = true;
            }
            break; 
            
    }  
}  

function onKeyUp(e) {  
    if(!e){
        var e = window.event;
    }  
  
    switch(e.keyCode) {  
        // left  
        case 65:
            left = false;  
            break;   
        // right  
        case 68:
            right = false;  
            break;   
        // Space bar for firing  
        case 32:
            if(fire != true){
                power = false;
                bullet.x = bean1.x;
                crosshair.Ready = false;
                fire = true;
                break; 
            }
    }  
}  

function shoot() { 
    bulletReady = true;
    bullet.x += 2;
    if ((bullet.x >= bean2.x) || (bullet.x >= shot_length)){
        bullet.x = bean1.x;
        bulletReady = false;
        crosshairReady = false;
        fire = false;
        shot_length = bean1.x;
    }
}  


/*--------------Start Update ------------------*/

var update = function(e){   
    if(left){
        bean1.x -= bean1.speed * e;
    }
    if(right){
        bean1.x += bean1.speed * e;
    }
    if(power){
        shot_length +=2;
        crosshair.x = shot_length;
    }
    
    if(fire){
        shoot();
    }

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

    if (crosshairReady)  {
        context.drawImage(crosshairImage, crosshair.x, crosshair.y);
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