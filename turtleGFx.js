var Pen = function(){
	this.color = "black";
	this.width = 1.0;
	this.up = true;
	this.down = !this.up;
};

var Turtle = function(){
	this.pen = new Pen();
	this.location = {
		'x': 0,
		'y': 0
	}; 
	this.orientation = 0;//degrees
	this.canvas = document.getElementById("stage");
	this.canvasCtx = this.canvas.getContext('2d');
	this.applyStrokeStyle();
};

Turtle.prototype.applyStrokeStyle = function(degrees){
	this.canvasCtx.lineWidth = this.pen.width;
	this.canvasCtx.strokeStyle = this.pen.color;
};

Turtle.prototype.move = function(distance){
	var move = this.calculateMove(distance);
	if (this.pen.up){
		this.canvasCtx.moveTo(move.x, move.y);
	} else {
		this.canvasCtx.lineTo(move.x, move.y);
	}
};

Turtle.prototype.calculateMove = function(distance){
	this.location['x'] += Math.cos(this.orientation) * distance;
	this.location['y'] += Math.sin(this.orientation) * distance;
	return this.location;
};

Turtle.prototype.turn = function(degrees){
	this.orientation += degrees;
};

Turtle.prototype.penDown = function(){
	// this.pen.down = true;
	this.pen.setState("down");
};

Turtle.prototype.penUp = function(){
	// this.pen.down = false;
	this.pen.setState("up");
};

Turtle.prototype.penSize = function(size){
	this.pen.width = size;
};

Turtle.prototype.penColor = function(color){
	// HEX
	// RGB
	//string; like blue, red, etc.
	this.pen.color = color;
};

