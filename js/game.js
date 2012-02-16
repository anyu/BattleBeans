// Create the canvas
var canvas = document.createElement("canvas");
var contex = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 450;
document.body.appendChild(canvas);

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

/* Bullet image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function () {
	bulletReady = true;
};
bulletImage.src = "images/bullet.png";
*/

// Game objects
var bean1 = {
	speed: 256 // movement in pixels per second
};
var bean2 = {
	speed: 256 // movement in pixels per second
};

// Reset game
var reset = function () {
	bean1.x = (Math.floor(Math.random()*201) + 480)/2;
	bean1.y = 350;
	bean2.x = 750;
	bean2.y = 350;
};

// Handle keyboard controls
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

};

// Draw everything
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

// Main game loop
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
