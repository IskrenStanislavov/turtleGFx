var Pen = function(){
	this.color = arguments['color'] || "#000000";
	this.width = arguments['width'] || 1.0;
	// this.up = arguments['up'] || !arguments['down'] || false;
	// this.down = arguments['down'] || !this.up;
	this.state = arguments["state"] || "up";
};

var Turtle = function(){
	this.pen = new Pen();
	this.orientation
};

// Turtle.prototype.isPenDown = function(){
// 	return this.pen.down;
// };

Turtle.prototype.move = function(distance){
	if (this.pen.state === "down"){
		//draw line to
		// this._draw(distance);
	} else {
		//simply move line to
		// this._justMove(distance);
	}
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

