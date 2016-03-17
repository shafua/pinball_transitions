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
		var distance2 = Math.abs( to[0] - BALL.currentPoint[0] ) + Math.abs( to[1] - BALL.currentPoint[1] );
		
		var travelTime = 1000 * distance;
		console.log(distance / distance2)

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
	BALL.destinationPoint = getRandomDestinationPoint();
	
	BALL.move(BALL.nextPoint)


	var intersection = barrier.check(BALL.nextPoint, BALL.destinationPoint);
	
	if (intersection) {
		//console.log("intersection", intersection)
		//console.log(BALL.nextPoint, BALL.destinationPoint)
		BALL.destinationPoint = [intersection[0], intersection[1]];
		//alert("intersection!")
	};
});

function makeB() {BALL.destinationPoint = getRandomDestinationPoint();
	
	var intersection = barrier.check(BALL.currentPoint, BALL.nextPoint);
	
	//if (intersection) console.log("intersection", intersection);
	BALL.move(BALL.nextPoint);
}

function getRandomDestinationPoint () {
		var projection = Math.random() * 4;
		// integer part of projection: id of screen side; fractional part: position on that side
		return projection < 2 ? ( projection  < 1 ? [projection, 0] : [0, projection - 1] ) : ( projection < 3 ? [projection - 2, 1] : [1, projection - 3] )
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
			coordinate;

		if ( p1[1] < this.ySegment[0] && p2[1] > this.ySegment[0] ) {
			coordinate = this.__getIntersectionOf2Straights(this.ySegment[0], 1/k, p1[1], p1[0]);
			if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[0]];
			
			if (coordinate < this.xSegment[0]) {
				coordinate = this.__getIntersectionOf2Straights(this.xSegment[0], k, p1[0], p1[1]);
				if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[0], coordinate];
			} else {
				coordinate = this.__getIntersectionOf2Straights(this.xSegment[1], k, p1[0], p1[1]);
				if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[1], coordinate];
			}
		};

		if ( p1[1] > this.ySegment[1] && p2[1] < this.ySegment[1] ) {
			coordinate = this.__getIntersectionOf2Straights(this.ySegment[1], 1/k, p1[1], p1[0]);
			if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[1]];
			
			if (coordinate < this.xSegment[0]) {
				coordinate = this.__getIntersectionOf2Straights(this.xSegment[0], k, p1[0], p1[1]);
				if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[0], coordinate];
			} else {
				coordinate = this.__getIntersectionOf2Straights(this.xSegment[1], k, p1[0], p1[1]);
				if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[1], coordinate];
			}
		};

		if ( p1[0] < this.xSegment[0] && p2[0] > this.xSegment[1] ) {
			coordinate = this.__getIntersectionOf2Straights(this.xSegment[0], k, p1[0], p1[1]);
			if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[0], coordinate];
			
			if (coordinate < this.xSegment[0]) {
				coordinate = this.__getIntersectionOf2Straights(this.ySegment[0], 1/k, p1[1], p1[0]);
				if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[0]];
			} else {
				coordinate = this.__getIntersectionOf2Straights(this.ySegment[1], 1/k, p1[1], p1[0]);
				if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[1]];
			}
		};

		if ( p1[0] > this.xSegment[1] && p2[0] < this.xSegment[0] ) {
			coordinate = this.__getIntersectionOf2Straights(this.xSegment[1], k, p1[0], p1[1]);
			if ( this.__isEnteringIntoaSegment(this.ySegment, coordinate) ) return [this.xSegment[1], coordinate];
			
			if (coordinate < this.xSegment[0]) {
				coordinate = this.__getIntersectionOf2Straights(this.ySegment[0], 1/k, p1[1], p1[0]);
				if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[0]];
			} else {
				coordinate = this.__getIntersectionOf2Straights(this.ySegment[1], 1/k, p1[1], p1[0]);
				if ( this.__isEnteringIntoaSegment(this.xSegment, coordinate) ) return [coordinate , this.ySegment[1]];
			}
		};

		return false
	}



	this.__isEnteringIntoaSegment = function (segment, coordinate) {
		return (coordinate > segment[0]) && (coordinate < segment[1])
	}




	this.__getIntersectionOf2Straights = function (y, k, f1, x1) {
		return y * k - f1 * k + x1
	}



















}