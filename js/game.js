// Create the canvas
var canvas = document.createElement("canvas");
var contex = canvas.getContext("2d");
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

// Bullet image -- not implemented yet
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function () {
	bulletReady = true;
};
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

// Reset game
var reset = function () {
	bean1.x = (Math.floor(Math.random()*601))/2;
	bean1.y = 350;
    bean2.x = 700;
	bean2.y = 350;
};

// Initial bean2 movement
var initial_bean2 = (Math.floor(Math.random()*2));

if(initial_bean2 == 1){
    var bean2_right = true;
}
if(initial_bean2 == 0){
    var bean2_left = false;
}

/********************************* Handle Keyboard Inputs ******************************/
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Keyboard Input
var update = function (e) {

	if (65 in keysDown) { // Player1 holding A
		bean1.x -= bean1.speed * e;
	}
	if (68 in keysDown) { // Player1 holding D
		bean1.x += bean1.speed * e;
	}
	if (37 in keysDown) { // Player2 holding left
		bean2.x -= bean2.speed * e;
	}
	if (39 in keysDown) { // Player2 holding right
		bean2.x += bean2.speed * e;
	}

    //stop bean from going past midpoint 
	bean1.x = bean1.x.stopPoint(0, (canvas.width/2) - 100);
	bean2.x = bean2.x.stopPoint((canvas.width/2), canvas.width - 100)

	//smooth randomizing movement of bean2 
	var random = (Math.floor(Math.random()*100)); //Generates random between 0 - 99
	//flip the direction 2% of the time
	if(random >= 99){ 
	    bean2_right = !bean2_right;
	}

	if(bean2_right){
        bean2.x += 2;
	}
	else{
		bean2.x -= 2;
	} 

};

// Stop beans from going off canvas or past middle
Number.prototype.stopPoint = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

/********************************* Draw Everything ******************************/
var render = function () {
	if (bgReady) {
		contex.drawImage(bgImage, 0, 0);
	}

	if (bean1Ready) {
		contex.drawImage(bean1Image, bean1.x, bean1.y);
	}
	
	if (bean2Ready) {
		contex.drawImage(bean2Image, bean2.x, bean2.y);
	}
/*
	if (bulletReady) {
		contex.drawImage(bulletImage, bullet.x, bullet.y);
	}
*/

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
