var Turtle = (function(){
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
	var radians = degrees * Math.PI / 360;
	this.orientation += radians;
};

Turtle.prototype.penDown = function(){
	this.pen.down = true;
	this.pen.up = !this.pen.down;
	this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(this.location.x, this.location.y);
};

Turtle.prototype.penUp = function(){
	this.pen.up = true;
	this.pen.down = !this.pen.up;
	this.canvasCtx.stroke();
};

Turtle.prototype.penSize = function(size){
	this.pen.width = size;
	this.applyStrokeStyle();
};

Turtle.prototype.penColor = function(color, G, B){
	if (typeof(color)==='string'){// penColor("red"), penColor("#0123456")
		this.pen.color = color;
	} else if ( typeof(color) === 'number' 
				&& typeof(G) === 'number' 
				&& typeof(B) === 'number'){
		//penColor(0,23,78)
		var color = color.toString(16),
			G = G.toString(16),
			B = B.toString(16);
		this.pen.color = '#'+color+G+B;

	} else {
		throw "unsuported color format";
	}
	// HEX
	// RGB
	//string; like blue, red, etc.
	this.applyStrokeStyle();
};

var LindenmayerCurve = function(cfg){
	this.init(cfg);
};

LindenmayerCurve.prototype.init = function(cfg){
	// this.variables = ["A","B"];
	// this.constants = [];
	this.start = cfg.start;
	this.rules = cfg.rules;
	// this.rules = {
	// 	'A': ['A','B'],
	// 	'B': ['A'],
	// }
};

LindenmayerCurve.prototype.getPathN = function(power){
	if (power === 0){
		return this.start;
	}
	var result = [];
	// console.log(power, "-=", this.getPathN(power-1));
	this.getPathN(power-1).forEach(function(elem, ix){
		// console.log("#$", elem, result, this.rules[elem] || [elem]);
		result = result.concat(this.rules[elem] || [elem]); //if constant just add it
		// console.log("#*****$", elem, result);
	}.bind(this))
	return result;
}

//#### test start ####//
var doTest = function(){
	var test_c1 = new LindenmayerCurve({
		'start': ['A'],
		'rules': {
			'A': ['A','B','A'],
			'B': ['A'],
		}
	});
	var testCaseResult=[
		["A"],
		["A", "B", "A"],
		["A", "B", "A", "A", "A", "B", "A"],
		["A", "B", "A", "A", "A", "B", "A", "A", "B", "A", "A", "B", "A", "A", "A", "B", "A"]
	];
	for (var testNum=0;testNum<4;testNum+=1){

		if (test_c1.getPathN(testNum).join('') != testCaseResult[testNum].join('')){
			throw "test failed", test_c1.getPathN(testNum);
		} else {
			console.error('test passed:', testNum);
		}
	}
};
doTest();
//#### test end ####//

var HilbertCurve = function(power){
	// http://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system
	this.power = power;
	this.init({
		'start': ['A'],
		'rules': {
			'A': ['−', 'B', 'F', '+', 'A', 'F', 'A', '+', 'F', 'B', '−'],
			'B': ['+', 'A', 'F', '−', 'B', 'F', 'B', '−', 'F', 'A', '+']
		}
	});
}
HilbertCurve.prototype = new LindenmayerCurve();
HilbertCurve.prototype.draw = function(){
	var path = this.getPathN(this.power);
	console.log(path.join(''));
};

// class Hilbert(LindenmayerCurve)
Turtle.prototype.drawHilbert = function(power){
	var hilbert = new HilbertCurve(1);
	hilbert.draw()
	// for (i = 0;i<3;i+=1){
	// 	console.log(i, c.getPathN(i));
	// } 
	// 0,(new LindenmayerCurve()).getPathN(0)
}

return Turtle;
})();
