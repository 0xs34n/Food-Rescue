// Game objects
function BlackBug() {
	this.levelOneSpeed = 1.5; //movement in pixels per second
	this.levelTwoSpeed = 2;
	this.score = 5;
	this.width = 10;
	this.height = 10;
	this.x = Math.floor((Math.random() * 390) + 10);
	this.y = 0;
	this.color = "#000000";
	this.direction;
}

function RedBug() {
	this.levelOneSpeed = 0.75; //movement in pixels per second
	this.levelTwoSpeed = 1;
	this.score = 3;
	this.width = 10;
	this.height = 10;
	this.x = Math.floor((Math.random() * 390) + 10);
	this.y = 0;
	this.color= "#FF0000";
	this.direction;
}

function OrangeBug() {
	this.levelOneSpeed = 0.6; //movement in pixels per second
	this.levelTwoSpeed = 0.8;
	this.score = 1;
	this.width = 10
;	this.height = 10;
	this.x = Math.floor((Math.random() * 390) + 10);
	this.y = 0;
	this.color = "#FFA500";
	this.direction
}

function food(x, y) {
	this.eaten = false;
	this.x = x;
	this.y = y;
}
/* STATIC VARIABLES */
var bugList; // List of bugs
var foodList;
var bugTimer;
var bugLag;
var gameTimer;
var clock;
var gameScore;
var levelOne;
var start;
var gameOver;
var highScore = 0;
var levelOneScoreTrack = 0;

function trackLevelOne() {
	levelOneScoreTrack = gameScore;
}

function newHighScore() {
	if (gameScore >= highScore) {
		highScore = gameScore;
		localStorage.highScore = highScore;
	}

}

function restartBugList() {
	bugList = [];
}

function restartBugTimer() {
	bugTimer = 0;
}

function restartGameTimer() {
	gameTimer = 0;
}

function setBugLag() {
	bugLag = bugLatency();
}

function restartClock() {
	clock = 0;
}

function restartGameScore() {
	gameScore = 0;
}

function isLevelOne() {
	levelOne = true;
}

function notLevelOne() {
	levelOne = false;
}

function startGame() {
	start = true;
}
function stopGame() {
	start = false;
}

function getStart() {
	return start;
}

function setGameOver() {
	gameOver = true;
}

function notGameOver() {
	gameOver = false;
}

function newFood() {
	foodList = [new food(Math.floor((Math.random() * 381) + 10), Math.floor((Math.random() * 471) + 120)), 
				new food(Math.floor((Math.random() * 381) + 10), Math.floor((Math.random() * 471) + 120)),
				new food(Math.floor((Math.random() * 381) + 10), Math.floor((Math.random() * 471) + 120)),
				new food(Math.floor((Math.random() * 381) + 10), Math.floor((Math.random() * 471) + 120)),
				new food(Math.floor((Math.random() * 381) + 10), Math.floor((Math.random() * 471) + 120))];

}

function increaseGameTimer(){
	gameTimer++;
}

function increaseBugTimer(){
	bugTimer++
}
/* GLOBAL GAME FUNCTIONS */

// Push a random bug onto the list of bugs
function randomBug() {
	var randomNum = Math.floor((Math.random() * 10) + 1) // Random # from 1 to 10

	if (randomNum <= 3){ //black bug
		bugList.push(new BlackBug());
	}

	if (randomNum >= 6) { //Orange bug
		bugList.push(new OrangeBug());
	}

	if (randomNum > 3 && randomNum < 6) {
		bugList.push(new RedBug());
	}
}

// Return a random time from 1 to 3 for bugs to appear
function bugLatency() {
	return Math.floor((Math.random() * 3) + 1)
}

// Kill the bug at index i
function killBug(i) {
	var killedBug = bugList[i]
	var alpha = 1.0;   // full opacity
	
    var interval = setInterval(function () {
		context.clearRect(killedBug.x-10,killedBug.y-10,20,80);
        if (killedBug.color == "#000000") {drawBug("rgba(000, 0, 0, " + alpha + ")", 
        								   killedBug.x, killedBug.y, killedBug.direction);}
        if (killedBug.color == "#FF0000") {drawBug("rgba(255, 0, 0, " + alpha + ")", 
        								   killedBug.x, killedBug.y, killedBug.direction);}
        if (killedBug.color == "#FFA500") {drawBug("rgba(255, 165, 0, " + alpha + ")", 
        								   killedBug.x, killedBug.y, killedBug.direction);}      
        alpha = alpha - 0.05; // decrease opacity (fade out)
        if (alpha < 0) {
			context.clearRect(killedBug.x-15,killedBug.y-15,20,50);
            clearInterval(interval);
        	console.log("animating kill bug");
        }
    }, 50);
	gameScore = gameScore + bugList[i].score
	bugList.splice(i, 1);
}

function canMove(iii) {

	var canMove = true;
	var right = iii+1;
	var left = iii-1;

	var theBug = bugList[iii]

	if (right < bugList.length) {
		for (right; right < bugList.length; right++){
			//if there is a close bug and the bugs score is lower, can't move.
			if (Math.abs(theBug.x-bugList[right].x) < 20 &&
				Math.abs(theBug.y-bugList[right].y) < 50 &&
			    theBug.score < bugList[right].score) { 
				canMove = false;
			} 

			if (theBug.color == bugList[right].color && 
				theBug.x-bugList[right].x <= 0 && 
				theBug.x-bugList[right].x > -20 && 
				Math.abs(theBug.y-bugList[right].y) < 50) {
						canMove = false;
					 } //if same score, then theBug is on the left within 10px, can't move.
		}
	}
	if (left > -1) {
		for (left; left > -1; left--) {
			//if there is a close bug and the bugs score is lower, can't move.
			if (Math.abs(theBug.x-bugList[left].x) < 20 &&
				Math.abs(theBug.y-bugList[left].y) < 50 && 
				theBug.score < bugList[left].score) {
				canMove = false;
			}

			if(theBug.color == bugList[left].color && 
			   theBug.x-bugList[left].x <= 0 && 
			   theBug.x-bugList[left].x > -20 && 
			   Math.abs(theBug.y-bugList[left].y) < 50) {
						canMove = false;
					 } //if same score, then theBug is on the left within 10px, can't move.
		}
	}
	return canMove;
}

// Move all the bugs in the list
function moveBugs() {
	for (i = 0; i < bugList.length; i++) { 
		// Add a move function that checks if there are adjacent bugs.
		if (canMove(i)) {
			moveBug(bugList[i]);
		}
	}
}

//Move a single bug
function moveBug(bug) {

	closestFood = findFood(bug);

	/* Move to the direction of the nearest food*/
	foodX = closestFood.x;
	foodY = closestFood.y;

	distanceX = Math.abs(bug.x - foodX);
	distanceY = Math.abs(bug.y - foodY);

	var travelX = 1
	var travelY = 1

	if (distanceX > distanceY) {
		travelY = distanceY/distanceX; 
	}

	if (distanceY > distanceX) {
		travelX = distanceX/distanceY; 
	}

	var north = false;
	var east = false;
	var south = false;
	var west = false;

	/*
	var ninety = 0;
	var twoSeventy = 0;
	var oneEighty = 0;
	var threeSixty = 0;*/

	if (bug.x > foodX) { // x = -1
		if(levelOne) {
			bug.x = bug.x -= bug.levelOneSpeed * travelX;
		} else {
			bug.x = bug.x -= bug.levelTwoSpeed * travelX;	
		}
		if (travelX > 0.5) {
			west = true;
		}
		//threeSixty = 360 * travelX;
	} 

	if (bug.x < foodX) { // x = +1
		if(levelOne) {
			bug.x = bug.x += bug.levelOneSpeed * travelX;
		} else {
			bug.x = bug.x += bug.levelTwoSpeed * travelX;
		}
		if (travelX > 0.5) {
			east = true;
		}
		//oneEighty = 180 * travelX;
	}

	if (bug.y > foodY) { // y = -1
		if(levelOne) {
		bug.y = bug.y -= bug.levelOneSpeed * travelY;
		} else {
			bug.y = bug.y -= bug.levelTwoSpeed * travelY;
		}
		if (travelY > 0.5) {
			north = true;
		}
		//twoSeventy = 270 * travelY;
	}

	if (bug.y < foodY) { // y = + 1
		if(levelOne) {
			bug.y = bug.y += bug.levelOneSpeed * travelY;
		} else {
			bug.y = bug.y += bug.levelTwoSpeed * travelY;
		}
		if (travelY > 0.5) {
			south = true;
		}
		//ninety = 90 * travelY;
	}

	/*
	if (distanceX > 0 && distanceY > 0) {
		bug.direction = (ninety + twoSeventy + oneEighty + threeSixty) / 2;
		console.log("diagnol direction is" + bug.direction);
	} else {
		bug.direction = ninety + twoSeventy + oneEighty + threeSixty;
		console.log("single direction is" + bug.direction);
	}*/
	// Direction of the bug
	if(north && east) {
		bug.direction = "northeast";
	}
	else if(north && west) {
		bug.direction = "northwest";
	}
	else if(south && east) {
		bug.direction = "southeast";
	}
	else if(south && west) {
		bug.direction = "southwest";
	}
	else if (north) {
		bug.direction = "north";
	}
	else if (east) {
		bug.direction = "east";
	}
	else if (south) {
		bug.direction = "south";
	}
	else if (west) {
		bug.direction = "west";
	}
}

/* Get the Closest Food by total difference of x and y */
function findFood(bug) {

	var totalDifference;
	// Assume smallest difference is first food.
	var smallestDifference = Math.abs(bug.x - foodList[0].x) + Math.abs(bug.y - foodList[0].y);
	var closestFood = foodList[0]; 

	for (ii = 1; ii < foodList.length; ii++) {
		thefood = foodList[ii];
		totalDifference = Math.abs(bug.x-thefood.x) + Math.abs(bug.y - thefood.y);

		if (totalDifference < smallestDifference) {
			smallestDifference = totalDifference;
			closestFood = foodList[ii];
		}
	}
	return closestFood
}

function eatFood(){
	for (b = 0; b < bugList.length; b++) {
		for (f = 0; f < foodList.length; f++) {
			if (Math.abs(foodList[f].x - bugList[b].x) <= 10 &&
				Math.abs(foodList[f].y - bugList[b].y <= 10)) {
				foodList.splice(f, 1);
			}
		}
	}
}


// Render all the food in the list
function renderFood() {
	for(i = 0; i < foodList.length; i++) {
		thefood = foodList[i];
		drawFood(thefood.x, thefood.y);
	}
}

// Render all the bugs in the list
function renderBugs() {

	for (i = 0; i < bugList.length; i++) { 
		bug = bugList[i];
	    drawBug(bug.color, bug.x, bug.y, bug.direction);
	}
}

// Render Clock on the top
function renderClock() {
	if (gameTimer > clock) {
		contextInfoBar.clearRect(20,40,150,30);
		var time = 60 - clock/100
		contextInfoBar.fillText("Time Remaining: " + time, 20, 65);
		clock = clock + 100;
	}
}

function renderScore() {
	contextInfoBar.fillText("Score: " + gameScore, 320, 65);
}

var tracker = 0;
function renderPause() {
	contextInfoBar.fillText("Pause", 215, 65);
	/*Game over mouse listener*/
	infoBar.addEventListener('click', function pauseClick(e) {


		if (e.pageY >= 50 && e.pageY <= 85 &&
			e.pageX >= 210 && e.pageX <= 280) {

			if(start) {
				stopGame();
				console.log("game stopped");
				contextInfoBar.clearRect(200,50,100,100);
				contextInfoBar.fillText("Play", 215, 85);
			}		}

		if (e.pageY >= 85 && e.pageY <= 100 &&
			e.pageX >= 210 && e.pageX <= 280) {

			if (!start) {
				startGame();
				console.log("game continued");
				contextInfoBar.clearRect(200,50,100,100);
				contextInfoBar.fillText("Pause", 215, 65);
			}
		}



	});
}

function renderLevel() {
	if (levelOne) {contextInfoBar.fillText("Level: 1", 180, 40);}
	else {contextInfoBar.fillText("Level: 2", 180, 40);}
}

// Draw the bugs on the canvas
function drawBug(color, x, y, angle) {

	var radian = angle * (3.14159265358979323846/180);
	var xCord = Math.cos(radian);
	var yCord = Math.sin(radian);

	if (angle == "south") {
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y - 7, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Left leg 
		context.beginPath();
		context.moveTo(x-5, y-33);
		context.lineTo(x-2, y-11);
		context.stroke(); 
		
		//Right leg
		context.beginPath();
		context.moveTo(x+5, y-33);
		context.lineTo(x+2, y-11);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x+2, y+5, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x-2, y+5, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if (angle == "southeast") {
		// southeast
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x-5, y-4, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Left leg
		context.beginPath();
		context.moveTo(x-25, y-10);
		context.lineTo(x-9, y-5);
		context.stroke();

		//Right leg
		context.beginPath();
		context.moveTo(x-15, y-25);
		context.lineTo(x-7, y-8);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x+4, y+1, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x+2, y+4, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if (angle == "east") {
		// east
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x-6, y, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Left leg
		context.beginPath();
		context.moveTo(x-26, y+4);
		context.lineTo(x-10, y+2);
		context.stroke();

		//Right leg
		context.beginPath();
		context.moveTo(x-26, y-4);
		context.lineTo(x-10, y-2);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x+4, y+3, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x+4, y-2, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if (angle == "northeast") {
		//northeast
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x-6, y+3, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Right leg
		context.beginPath();
		context.moveTo(x-21, y+19);
		context.lineTo(x-7, y+4);
		context.stroke();

		//Left leg
		context.beginPath();
		context.moveTo(x-28, y+4);
		context.lineTo(x-10, y+3);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x+4, y+2, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x+2, y-4, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if (angle == "north") {
		//north
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y+7, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Right leg
		context.beginPath();
		context.moveTo(x+5, y+26);
		context.lineTo(x+2, y+11);
		context.stroke();

		//Left leg
		context.beginPath();
		context.moveTo(x-6, y+26);
		context.lineTo(x-2, y+11);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x+3, y-4, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x-3, y-4, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if(angle == "northwest") {
		// northwest
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x+5, y+4, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Right leg
		context.beginPath();
		context.moveTo(x+27, y+7);
		context.lineTo(x+9, y+4);
		context.stroke();

		//Left leg
		context.beginPath();
		context.moveTo(x+15, y+20);
		context.lineTo(x+6, y+7);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x-2, y-5, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x-5, y-2, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if (angle == "west") {
		//west
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x+7, y, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Right leg
		context.beginPath();
		context.moveTo(x+32, y-6);
		context.lineTo(x+10, y-1);
		context.stroke();

		//Left leg
		context.beginPath();
		context.moveTo(x+32, y+6);
		context.lineTo(x+10, y+1);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x-4, y-3, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x-4, y+3, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

	else if ("southwest") {
		// southwest
		// Draw the head
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 2, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		// Draw the body
		context.fillStyle = color;
		context.beginPath();
		context.arc(x+5, y-4, 3, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 0.5;
		context.stroke();
		context.fillStyle = "black";

		//Right leg
		context.beginPath();
		context.moveTo(x+23, y-24);
		context.lineTo(x+7, y-8);
		context.stroke();

		//Left leg
		context.beginPath();
		context.moveTo(x+33, y-12);
		context.lineTo(x+9, y-4);
		context.stroke();

		//Right Ear
		context.beginPath();
		context.arc(x-2, y+4, 1, Math.PI, 2*Math.PI-2,true);
		context.lineWidth = 0.5;
		context.stroke();

		//Left Ear
		context.beginPath();
		context.arc(x-5, y, 1, Math.PI+2, 2*Math.PI,true);
		context.lineWidth = 0.5;
		context.stroke();
	}

}

// Draw the food on the canvas
function drawFood(x, y) {
	//the buns
	context.beginPath();
	context.strokeStyle="#E9967A";
	context.fillStyle="#E9967A";
	context.fillRect(x-18,y-10,20,5);
	context.fillRect(x-18,y+5,20,5);
	context.closePath();

	//meat
	context.beginPath();
	context.strokeStyle="#FF0000";
	context.moveTo(x,y+3);
	context.lineTo(x-16,y+3);
	context.lineWidth=3;
	context.stroke();
	context.closePath();

	//cheese
	context.beginPath();
	context.strokeStyle="#FFD700";
	context.moveTo(x,y);
	context.lineTo(x-16,y);
	context.lineWidth=2;
	context.stroke();
	context.closePath();

	//lettuce
	context.beginPath();
	context.strokeStyle="#008000";
	context.moveTo(x,y-3);
	context.lineTo(x-16,y-3);
	context.lineWidth=3;
	context.stroke();
	context.closePath();
}
// Start Menu
function startMenu() {

	restartBugList();
	newFood();
	restartBugTimer();
	restartGameTimer();
	restartClock();
	restartGameScore();
	newHighScore();
	isLevelOne();
	stopGame();
	setGameOver();
	setBugLag();

	contextInfoBar.clearRect(0,0,400,100);
	context.clearRect(0,0,400,600);

	contextInfoBar.font = "18px Avenir Next";
	contextInfoBar.fillText("Click the bugs before it reaches your food!",5,30);
	contextInfoBar.font = "14px Avenir Next";
	contextInfoBar.fillText("Created with vanilla JavaScript and HTML5 Canvas.",20,60);
	contextInfoBar.fillText("Copyright Sean Han 2015.",100,80);

	context.font = "bold 100px Avenir Next";
	context.fillText("FOOD",30,130);
	context.font = "bold 80px Avenir Next";
	context.fillText("rescue",60,200);

	context.font = "bold 200px Avenir Next";
	context.fillText("!",330,200);

	context.font = "15px Avenir Next";
	context.fillText("Level 1", 80,300);
	context.beginPath();
	context.arc(100,320,10,0,2*Math.PI);
	context.stroke();  
	context.fill();

	context.fillText("Level 2",270,300);
	context.beginPath();
	context.arc(292,320,10,0,2*Math.PI);
	context.stroke();

	context.fillText("Highscore:",150,400);
	context.fillText(localStorage.highScore,170,420);

	context.font = "30px Avenir Next";
	context.fillText("START",151,500);
	context.rect(120,455,150,70);
	context.stroke();

	// Start menu click listener
	game.addEventListener('click', doclick, false);
	function doclick(e) {
		if (e.pageY >= 560 && e.pageY <= 640 &&
			e.pageX >= 120 && e.pageX <= 280) {
			start = true;
			gameOver = false;
			console.log("main menu click successful");
			game.removeEventListener('click', doclick);
			contextInfoBar.clearRect(0,0,400,100);

		}

		if (e.pageY >= 420 && e.pageY <= 445 &&
			e.pageX >= 290 && e.pageX <= 310) {
			levelOne = false;

			// level 1 empty
			context.clearRect(90,310,20,20);
			context.beginPath();
			context.arc(100,320,10,0,2*Math.PI);
			context.stroke();
		
			// level 2 filled
			context.beginPath();
			context.arc(292,320,10,0,2*Math.PI);
			context.stroke();
			context.fill();
		}

		if (e.pageY >= 420 && e.pageY <= 445 &&
			e.pageX >= 100 && e.pageX <= 120) {
			levelOne = true;

			// level 1 full
			context.clearRect(90,310,20,20);
			context.beginPath();
			context.arc(100,320,10,0,2*Math.PI);
			context.stroke();
			context.fill();
		
			// level 2 empty
			context.clearRect(282,310,20,20);
			context.beginPath();
			context.arc(292,320,10,0,2*Math.PI);
			context.stroke();
		}
	}
}

function gameOverMenu(gameTimer) {
	if ((gameTimer >= 6000 && !levelOne) || foodList.length == 0) {

		newHighScore(); // Check new high score.
		restartBugList(); // No bugs to kill on game over screen.

		// Game Over
		gameOver = true;
		context.font = "bold 60px Avenir Next";
		context.fillStyle = "black";
		context.fillText("Game Over!",20,200);

		//High Score
		context.font = "30px Avenir Next";
		if (levelOneScoreTrack > gameScore) {
			context.fillText("Score: " + levelOneScoreTrack.toString(),150,300);
		} else {
			context.fillText("Score: " + gameScore.toString(),150,300);
		}

		// Restart
		context.strokeStyle="#000000";
		context.font = "30px Avenir Next";
		context.fillText("Restart",65,500);
		context.rect(40,455,150,70);
		context.stroke();

		// Quit
		context.strokeStyle="#000000";
		context.font = "30px Avenir Next";
		context.fillText("Quit",255,500);
		context.rect(225,455,125,70);
		context.stroke();

		/*Game over mouse listener*/
		game.addEventListener('click', function gameOverClick(e) {

			// Restart
			if (e.pageY >= 565 && e.pageY <= 635 &&
				e.pageX >= 50 && e.pageX <= 200) {

				restartBugList();
				newFood();
				restartBugTimer();
				restartGameTimer();
				restartClock();
				newHighScore();
				restartGameScore();
				/* current level */
				startGame();
				notGameOver();
				setBugLag();


				console.log("restart successful");

				game.removeEventListener('click', gameOverClick, false);
			}

			// Quit
			if (e.pageY >= 565 && e.pageY <= 635 &&
				e.pageX >= 235 && e.pageX <= 360) {
				startMenu();
				console.log("quit successful");
				game.removeEventListener('click', gameOverClick, false);
			}
		});

	}
}
/* RUNNING THE GAME */

// Create the canvas
var game = document.getElementById("game");
var context = game.getContext("2d");

//Create the info canvas
var infoBar = document.getElementById("infoBar");
var contextInfoBar = infoBar.getContext("2d");

// Kill bug on mouse click
game.addEventListener('mousedown', doMouseDown, false); 
function doMouseDown(e) {
	for (b = 0; b < bugList.length; b++){
		if (Math.abs(e.pageY-100 - bugList[b].y) <= 30 &&
			Math.abs(e.pageX - bugList[b].x) <= 30) {
			killBug(b);
		}
	} 
}



//Launch start menu
startMenu();

// Launch Game
gameInterval = setInterval(function(){

	rungame(); 

}, 1000/100)


function rungame() {
	if (start) {
		update();
		render();
	}
}

function update() {

	// Clear mouse listeners

	// Clear the board
	context.clearRect(0,0,400,600);
	contextInfoBar.clearRect(170,0,230,100);

	//Check game over after level 2, or no food left.
	gameOverMenu(gameTimer);

	if (!gameOver) {

		// Go to level 2
		if (gameTimer == 6000 && levelOne) {
			restartBugList();
			newFood();
			restartBugTimer();
			setBugLag();
			restartGameTimer();
			restartClock();
			newHighScore();
			trackLevelOne();
			restartGameScore();
			notLevelOne();
			startGame();
			notGameOver();

		}
		increaseGameTimer();

		//Eat Food
		eatFood();
		
		// Move the Bug
		moveBugs();

		// Create a bug if 3 seconds has passed
		if (bugTimer == bugLag * 100) {

			randomBug();
			restartBugTimer();
			setBugLag();
		}
		increaseBugTimer();
	}
}

function render() {

	if (!gameOver) {

		// Render Bugs
		renderBugs();

		// Render Food
		renderFood();

		// Render info bar
		renderLevel();
		renderClock();
		renderScore();
		renderPause();
	}
}
