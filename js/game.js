// Create the canvas
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 450;
document.body.appendChild(canvas);

/********************************* Define Game Objects ******************************/

var bean1 = {};
var bean2 = {};
var bean1Ready = true;

//Bean Contructor
function Bean(stage, path, x_pos){
    this.x = Math.floor(x_pos);
    this.y = 350;
    this.height = 30;
    this.width = 20;
    this.speed = 256;
    var that = this;
    var image = new Image();
    image.src = path;
    this.render = function(){ 
        // if (bean1Ready) {
            stage.drawImage(image, that.x, that.y);
        // }
    };
}

//Bullet Contructor
function Bullet(stage, path, x_pos){
    this.x = x_pos;
    this.y = 350;
    this.height = 10;
    this.width = 10;
    this.speed = 256;
    var that = this;
    var image = new Image();
    image.src = path;
    image.onload = function(){
        stage.drawImage(image, that.x, that.y);            

    }
}

//Background Contructor
function Game(stage, path){
    this.x = 0;
    this.y = 0;
    var that = this;
    var image = new Image();
    image.src = path;
    image.onload = function(){
        stage.drawImage(image, that.x, that.y); //load bg image
        bean1 = new Bean(context, 'images/bean1.png', Math.random()*350+50); //loads bean1
        bean2 = new Bean(context, 'images/bean2.png', Math.random()*350+500); //loads bean2
        bean1.render();
        bean2.render();
    }
}

var bg = new Game(context, 'images/landscape1.jpg');
var bullet = new Bullet(context, 'images/bullet.png', bean1.x + 35);


//function crosshairs(x_pos){
//    crosshairs.x,
//    crosshairs.y = 350,
//    crosshairs.image = new Image(),
//    crosshairs.image.src = 'images/crosshair.png';
//}
//

/********************************* Keyboard Input ******************************/

//document.keydown = function(e){
//    switch(e.keyCode) {
//        // left
//        case 65:
//            bean1.x -= 5;
//            break;
//        // right
//        case 68:
//            bean1.x += 5;
//            break;
//        // spacebar
//        case 32:
//            
//            break;
//    }
//}
//
//document.onKeyUp = function(){
//
//    }



///********************************* Object Attributes ******************************/
//var bean1 = {
//    speed: 256 // movement in pixels per second
//};
//var bean2 = {
//    speed: 256
//};
//
//var bullet = {};
//var crosshair = {};

//// Reset game
//var reset = function () {
//    bean1.x = (Math.floor(Math.random()*601))/2;
//    bean1.y = 350;
//    bean2.x = 700;
//    bean2.y = 350;
//    bullet.x = bean1.x;
//    bullet.y = 350;
//    crosshair.x = bean1.x;
//    crosshair.y = 350;
//};
//
//// Initial bean2 movement
//var initial_bean2 = (Math.floor(Math.random()*2));
//var counter = 0; //used to determine number of times the loop has completed
//
//if(initial_bean2 == 1) {
//    var bean2_right = true;
//}
//if(initial_bean2 == 0) {
//    var bean2_left = false;
//}
//
///********************************* Handle Keyboard Inputs ******************************/
//var left = false;
//var right = false;
//var fire = false;
//var power = false;
//
//var shot_length = bean1.x;
//var index = 0;     //used to track if spacebar is pressed once or held down
//
document.addEventListener('keydown',onKeyDown,false);

// document.onkeydown = onKeyDown;
// document.onkeyup = onKeyUp;
var moveLoop = {};
// when right key is pressed, setInterval(function to move bean xpos, repeat every __milisecs)


function onKeyDown(evt){

    console.log(evt); 
    
    if (evt.keyCode == 65) {        
        bean1.x -= 20;
        bean1.render();
        // bean1Ready = false;
    }

    if (evt.keyCode == 68) {      
        bean1.x += 20;
        bean1.render();

    }

}

// function onKeyUp(evt) {


// }


// function onKeyDown(e) {
//     if(!e) {
//         var e = window.event;
//     }
//     switch(e.keyCode) {
//         case 65:
//             moveLoop = setInterval(moveBeanRight(1000),20);
//     }
// }

// function onKeyUp(e) {
//     if(!e) {
//         var e = window.event;
//     }
//     switch(e.keyCode) {
//        // left
//         case 65:
//             clearInterval(moveLoop);
//     }
// }

// var moveBeanRight = function(e) {
//     bean1.x += bean1.speed * e;

// }


// var update = function(e){
// //    if(left){
//        bean1.x -= bean1.speed * e;
//    }
//    if(right){
//        bean1.x += bean1.speed * e;
//    }

// function onKeyDown(e) {
//    if(!e) {
//        var e = window.event;
//    }
//    switch(e.keyCode) {
//        // left
//        case 65:
//            left = true;
//            right = false;
//            break;
//        // right
//        case 68:
//            right = true;
//            left = false;
//            break;
//        // spacebar for power
//        case 32:
//            if(fire != true) {     // can't press space again while bullet in flight
//                power = true;
//                index++;
//            }
//            break;
//    }
//}
//
//function onKeyUp(e) {
//    if(!e) {
//        var e = window.event;
//    }
//    switch(e.keyCode) {
//        // left
//        case 65:
//            left = false;
//            break;
//        // right
//        case 68:
//            right = false;
//            break;
//        // spacebar for firing
//        case 32:
//            if(fire != true) {
//                power = false;
//                fire = true;
//                bullet.x = bean1.x;
//                index = 0;
//                break;
//            }
//    }
//}
//
//function shoot() {
//    bulletReady = true;
//    bullet.x += 3;
//
//    if (bullet.x >= bean2.x) {   // if bullet hits bean 2
//        fire = false;
//        bean2Ready = false;
//        bulletReady = false;
//        crosshairReady = false;
//
//        bullet.x = bean1.x;
//        gameOver();
//    }
//
//    if (bullet.x >= shot_length) {   // if bullet goes past shot length
//        fire = false;
//        bulletReady = false;
//        crosshairReady = false;
//
//        bullet.x = bean1.x;
//    }
//}
//
///************************************ Start update **************************/
//
//var update = function(e){
//    if(left){
//        bean1.x -= bean1.speed * e;
//    }
//    if(right){
//        bean1.x += bean1.speed * e;
//    }
//    if(power){
//        if(index == 1) {            // when spacebar is pressed only once, reset crosshair+shot_length to bean1 position
//            shot_length = bean1.x;
//            crosshair.x = bean1.x;
//        }
//        crosshairReady = true;
//        shot_length += 3;
//        crosshair.x += 3;
//    }
//
//    if(fire){
//        shoot();
//    }
//
//    //stop bean from going past midpoint
//    bean1.x = bean1.x.stopPoint(0, (canvas.width/2) - 50);
//    bean2.x = bean2.x.stopPoint((canvas.width/2) + 50, canvas.width - 55);
//
//    //loop only allows direction change after a 100 frames
//    counter ++;
//    var random_frame = (Math.floor(Math.random() * 50)) + 50 //generates random btwn 50-100
//    if(counter > random_frame){
//        var random = (Math.floor(Math.random() * 100)); //Generates random between 0 - 99
//        //flip the direction 2% of the time
//        if(random >= 98){
//            bean2_right =! bean2_right;
//            counter = 0; //reset counter after successful direction change
//        }
//    }
//
//    if(bean2_right){
//        bean2.x += bean2.speed * e;
//    }
//    else{
//        bean2.x -= bean2.speed * e;
//    }
//};
//
//// Stop beans from going off canvas or past middle
//Number.prototype.stopPoint = function(min, max) {
//    return Math.min(Math.max(this, min), max);
//};
//
//

////***********************************
////This didn't work either :/
////***********************************
////    if (aim_arcReady) {
////        context.arc(bean1.x, bean1.y, ((bean1.x/bean2.x)/2), math.pi, (2*math.pi), false);
////        context.lineWidth = 2;
////        context.strokeStyle = "#000"; // line color = black
////        context.stroke();
////    }
////************************************
//
//
//};
//
///********************************* Main Game Loop ******************************/
//var main = function () {
//    var now = Date.now();
//    var delta = now - then;
//
//    update(delta / 1000);
//    render();
//
//    then = now;
//};
//
//var gameOver = function() {
//    reset();
//}
//
//// Start game!
//reset();
//var then = Date.now();
//setInterval(main, 1); // Execute as fast as possible

