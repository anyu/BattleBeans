$(function() {
	//jQuery will run this after the document loads completely
	
	//same as document.getElementById('canvas');
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');

	//character 1: X & Y position, width, height
	var bean1X = Math.floor(Math.random()*301)/5; //generates an X position that is between 1 and 300
	var bean1X = (Math.round(bean1X))*5;
    //alert(bean1x);
    var bean1Y = 300;
	var bean1Height = 20;
	var bean1Width = 20;
	var bean1DeltaX = 0; // will eventually be used for movement
	var bean1DeltaY = 0; // will eventually be used for movement

	//draw character 1
	function draw_bean1() {
		context.fillStyle = "#000";
		context.fillRect(bean1X, bean1Y, bean1Width, bean1Height);
	}

	//character 2: X & Y position, width, height
	var bean2X = (Math.floor(Math.random()*301) + 380)/5; //generates an X position that is between 401 and 680 (b/c 700 is end of screen)
    var bean2X = (Math.round(bean2X))*5;
    //alert(bean2x);
	var bean2Y = 300;
	var bean2Height = 20;
	var bean2Width = 20;
	var bean2DeltaX = 0; //will eventually be used for movement
	var bean2DeltaY = 0; //will eventually be used for movement

	//draw character 2
	function draw_bean2() {
		context.fillStyle = "#000";
		context.fillRect(bean2X, bean2Y, bean2Width, bean2Height);
	}

	//X & Y for floor
	var floorX = 0;
	var floorY = 320;
	var floorHeight = 80;
	var floorWidth = 700;

	//draw floor
	function draw_floor() {
		context.fillStyle = "#006400";
		context.fillRect(floorX, floorY, floorWidth, floorHeight);
	}

	//bullet positioning
	var bulletX = bean1X + 25; //shooting from bean 1
	var bulletY = bean1Y + 10; //shooting from bean 1
	var bulletRadius = 8;
	var bulletDeltaX;
	var bulletDeltaX;

	//draw bullet
	function draw_bullet() {
		//context.beginPath when you draw primitive shapes
		context.beginPath();

		//draw arc at center bulletX, bulletY with radius bulletRadius,
		//from 0 to 2xPI radians (full circle)
		context.arc(bulletX, bulletY, bulletRadius, 0, Math.PI * 2, true);

		context.fillStyle = "#4A4A4A";
		context.fill();
	}

	function shoot_bullet() {
		//before shooting, check to see if going to hit something
		if ((bulletX + bulletDeltaX) == (bean2X)){
			endGame();
		}
		bulletX = bulletX + bulletDeltaX;
		bulletY = bulletY + bulletDeltaY;
	}

	function animate() {
	
		//clears at the beginning so movement isn't distorted
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		//initial drawing to set positions
		draw_bean1();
		draw_bean2();
		draw_floor();				
		
		//when spacebar is pressed, the bullet is drawn and shot
		if (spaceDown) {
			draw_bullet();
			shoot_bullet();}
		}

		spaceDown = false;

		//set spaceDown boolean variable as true if the space key is pressed. 32 is the keycode for the spacebar
		function onKeyDown(evt) {
			if (evt.keyCode == 32) spaceDown = true;
		}
		$(document).keydown(onKeyDown);
       
	//this starts a game
	function startGame() {
		bulletDeltaX = 5;
		//call the animate() function every 20ms until clearInterval(gameLoop) is called
		gameLoop = setInterval(animate, .01);
	}

	//this ends the game
	function endGame() {
		clearInterval(gameLoop);
		context.fillText('The End!!!!', canvas.width / 2.3, canvas.height / 2);
	}

	startGame();

});


