function bean (height, width, startX, startY, changeX) {
	this.height = height;
	this.width = width;
	this.startX = startX;
	this.startY = startY;
	this.changeX = changeX;	
}


function projectile (startX, startY, radius, changeX, changeY) {
	this.startX = startX;
	this.startY = startY;
	this.radius = radius;
	this.changeX = changeX;		
	this.changeY = changeY;	

}

function floor (height, width) {
	this.height = height;
	this.width = width;
}



