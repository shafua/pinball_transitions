var BALL = {
	element: ball_element,
	currentPoint: [.5, .5],
	nextPoint: getRandomDestinationPoint(),
	destinationPoint: [],
	move: function (to) {
		this.element.setAttribute("style","left:"+(to[0]*100)+"%;top:"+(to[1]*100)+"%;")
	}
}


BALL.element.addEventListener('transitionend', function() {
	BALL.move(BALL.nextPoint)
	BALL.currentPoint = [BALL.nextPoint[0], BALL.nextPoint[1] ]
	BALL.nextPoint =  [BALL.destinationPoint[0], BALL.destinationPoint[1] ]
	BALL.destinationPoint = getRandomDestinationPoint();
});

function makeB() {BALL.destinationPoint = getRandomDestinationPoint();
	BALL.move(BALL.nextPoint);
}

function getRandomDestinationPoint () {
		var projection = Math.random() * 4;
		// integer part of projection: id of screen side; fractional part: position on that side
		return projection < 2 ? ( projection  < 1 ? [projection, 0] : [0, projection - 1] ) : ( projection < 3 ? [projection - 2, 1] : [1, projection - 3] )
}