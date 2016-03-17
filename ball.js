var BALL = {
	element: ball_element,
	currentPoint: [.5, .5],
	nextPoint: getRandomDestinationPoint(),
	destinationPoint: [],
	move: function (to) {
		to = to || BALL.nextPoint;
		//console.log("moving from", BALL.currentPoint)
		//console.log("moving to", to)

		FLAGS.movingtop = BALL.currentPoint[1] != to[1];
		FLAGS.movingleft = BALL.currentPoint[0] != to[0];
		var distance = Math.sqrt( Math.pow( to[0] - BALL.currentPoint[0] , 2 ) + Math.pow( to[1] - BALL.currentPoint[1] , 2 ) );
		//var distance2 = Math.abs( to[0] - BALL.currentPoint[0] ) + Math.abs( to[1] - BALL.currentPoint[1] );
		
		var travelTime = 250 * distance;
		//console.log(distance / distance2)

		this.element.setAttribute("style","left:"+(to[0]*100)+"%;top:"+(to[1]*100)+"%;transition-duration:"+travelTime+"ms;")
	}
}; 
var FLAGS = {
	movingtop: false,
	movingleft: false
};

barrier = new Barrier(button);


BALL.element.addEventListener('transitionend', function(e) {
	if (FLAGS.movingtop && FLAGS.movingleft) {
		//console.log("ignore " + e.propertyName, "left==="+FLAGS.movingleft, "topp==="+FLAGS.movingtop)
		FLAGS["moving"+e.propertyName] = false;
		return;
	};
	//console.log("ignore nothing")


	BALL.currentPoint = [BALL.nextPoint[0], BALL.nextPoint[1] ]
	BALL.nextPoint =  [BALL.destinationPoint[0], BALL.destinationPoint[1] ]
	//BALL.destinationPoint = getRandomDestinationPoint();
	BALL.destinationPoint = getDestinationPoint(BALL.currentPoint, BALL.nextPoint);
	// console.log("got dp (event)", BALL.destinationPoint)

	BALL.move(BALL.nextPoint)
	

	var intersection = barrier.check(BALL.nextPoint, BALL.destinationPoint);

	if (intersection) {
		BALL.destinationPoint = [intersection[0], intersection[1]];
		console.log( "intersected at", intersection)

		var div = document.createElement('div');
		div.className = "bf";
		div.style.left = (intersection[0]*100)+"%";
		div.style.top = (intersection[1]*100)+"%";
		main.appendChild(div)
	};
});

function makeB() {
	BALL.destinationPoint = getDestinationPoint(BALL.currentPoint, BALL.nextPoint);
	//console.log("got dp (make fn)", BALL.destinationPoint)
	
	var intersection = barrier.check(BALL.currentPoint, BALL.nextPoint);
	
	if (intersection) console.log("intersection when first", intersection);
	BALL.move(BALL.nextPoint);
}

function getRandomDestinationPoint () {
		var projection = Math.random() * 4;
		// integer part of projection: id of screen side; fractional part: position on that side
		return projection < 2 ? ( projection  < 1 ? [0, projection] : [projection - 1, 0] ) : ( projection < 3 ? [0, projection - 2] : [projection - 3, 1] )
}

function getIntersectionOf2Straights (y, k, f1, x1) {
		return (y - f1) * k + x1
	}
function isEnteringIntoaSegment (segment, coordinate) {
		return (coordinate > segment[0]) && (coordinate < segment[1])
	}

function getDestinationPoint(currentPoint, nextPoint) {
	//alert("getDestinationPoint?")
	//console.log("getDestinationPoint:", currentPoint, nextPoint)
	var vector = [nextPoint[0] - currentPoint[0], nextPoint[1] - currentPoint[1]], coordinate;
	//+(vector[0] > 0) // +(vector[1] > 0)



	if (vector[0]===0) return [nextPoint[0], +!(nextPoint[1])];
	if (vector[1]===0) return [+!(nextPoint[0]) , nextPoint[1]];
		
		if (nextPoint[0]){
			coordinate = getIntersectionOf2Straights(0, -vector[1]/vector[0], nextPoint[0],  nextPoint[1]);
			if (isEnteringIntoaSegment([0,1], coordinate) ) return [0, coordinate];
		};
		if (nextPoint[0]!==1){
		
			coordinate = getIntersectionOf2Straights(1, -vector[1]/vector[0], nextPoint[0],  nextPoint[1]);
			if (isEnteringIntoaSegment([0,1], coordinate) ) return [1, coordinate];
		};
		if (nextPoint[1]){
			coordinate = getIntersectionOf2Straights(0, -vector[0]/vector[1], nextPoint[1],  nextPoint[0]);
			if (isEnteringIntoaSegment([0,1], coordinate) ) return [coordinate, 0];
		}
		if (nextPoint[1]!==1){
			coordinate = getIntersectionOf2Straights(1, -vector[0]/vector[1], nextPoint[1],  nextPoint[0]);
			if (isEnteringIntoaSegment([0,1], coordinate) ) return [coordinate, 1];
		}

console.log('never happens')
}

function Barrier(element) {
	this.element = element;
	var parentWidth = element.offsetParent.offsetWidth,
		parentHeight = element.offsetParent.offsetHeight,
		radius = BALL.element.offsetWidth/2;

	this.xSegment = [(element.offsetLeft - radius) / parentWidth, (element.offsetLeft + element.offsetWidth + radius) / parentWidth]
	this.ySegment = [(element.offsetTop - radius) / parentHeight, (element.offsetTop + element.offsetHeight + radius) / parentHeight]

	this.check = function (p1,p2) {
		var k = (p2[1] - p1[1])/(p2[0] - p1[0]), // k for y=; for x= use 1/k
			coordinate, intersectionDirection;

		aboveMap = this.__pointAboveWhat(p1);

		for (var i = 0; i < 4; i++) {
			if (!aboveMap[i]) continue;
			intersectionDirection = i%2 ? [this.ySegment[ +(i - 2 >= 0) ], 1/k, p1[1], p1[0], "x"] : [this.xSegment[ +(i - 2 >= 0) ], k, p1[0], p1[1], "y"] ;
			coordinate = getIntersectionOf2Straights(intersectionDirection[0], intersectionDirection[1], intersectionDirection[2], intersectionDirection[3]);
			if ( isEnteringIntoaSegment(this[ intersectionDirection[4]+"Segment" ], coordinate) ) return intersectionDirection[4] === "x" ? [coordinate, intersectionDirection[0], true] : [ intersectionDirection[0], coordinate, false];
		};

		}


	this.__pointAboveWhat = function (p) {
		return [
			 p[0] < this.xSegment[0],
			 p[1] < this.ySegment[0],
			 p[0] > this.xSegment[1],
			 p[1] > this.ySegment[1]
		 ]
	}





}