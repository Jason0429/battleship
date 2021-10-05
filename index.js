const startBtn = document.querySelector('.startBtn');
const titlePage = document.querySelector('.title-page');
const gamePage = document.querySelector('.game-page');
const upArrow = 38;
const downArrow = 40;
const leftArrow = 37;
const rightArrow = 39;
var userBoard = document.getElementById('user-board');
var compBoard = document.getElementById('comp-board');
var logInput = document.getElementById('log-input');
var logHeader = document.getElementById('log-header');
var logScreen = document.getElementById('log-screen');
var logOutput = document.getElementById('log-output');
var won = false;

var letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' ];

var ships = [
	{
		name: 'Aircraft',
		coords: [ 'a1', 'b1', 'c1', 'd1', 'e1' ],
		space: 5,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Battleship',
		coords: [ 'a3', 'b3', 'c3', 'd3' ],
		space: 4,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Destroyer',
		coords: [ 'a5', 'b5', 'c5' ],
		space: 3,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Submarine',
		coords: [ 'a7', 'b7', 'c7' ],
		space: 3,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Patrol Boat',
		coords: [ 'a9', 'b9' ],
		space: 2,
		hit: 0,
		orientation: '',
		dead: false
	}
];

var compShips = [
	{
		name: 'Aircraft',
		coords: [ 'a1', 'b1', 'c1', 'd1', 'e1' ],
		space: 5,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Battleship',
		coords: [ 'a3', 'b3', 'c3', 'd3' ],
		space: 4,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Destroyer',
		coords: [ 'a5', 'b5', 'c5' ],
		space: 3,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Submarine',
		coords: [ 'a7', 'b7', 'c7' ],
		space: 3,
		hit: 0,
		orientation: '',
		dead: false
	},
	{
		name: 'Patrol Boat',
		coords: [ 'a9', 'b9' ],
		space: 2,
		hit: 0,
		orientation: '',
		dead: false
	}
];

var currentShip = ships[0]; // current ship selected

// Used during render() to remove color from items that are not in totalCoords()
function totalCoords() {
	let coordinates = [];
	for (let i = 0; i < ships.length; i++) {
		for (let k = 0; k < ships[i].coords.length; k++) {
			coordinates.push(ships[i].coords[k]);
		}
	}
	return coordinates;
}

function scrollDown() {
	let height = titlePage.clientHeight;
	window.scrollBy({
		top: height,
		left: 0,
		behavior: 'smooth'
	});

	setTimeout(
		appendInstruction('Click on each ship and re-arrange them using the arrow keys on your keyboard.'),
		2000
	);
	setTimeout(appendInstruction(''), 2000);
	setTimeout(appendInstruction('You can rotate the orientation of the ship using the Rotate button'), 2500);
}

function initialize() {
	window.scrollTo(0, 0);

	let letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' ];
	let userRow = userBoard.getElementsByTagName('tr');
	let compRow = compBoard.getElementsByTagName('tr');

	// Assigns coordinates as id attribute to each cell on UserBoard and CompBoard
	for (let i = 0; i < 11; i++) {
		for (let k = 1; k < 12; k++) {
			let userCell = userRow[i].getElementsByTagName('td')[k];
			let compCell = compRow[i].getElementsByTagName('td')[k];
			userCell.id = letters[k - 1] + (i + 1);
			compCell.id = letters[k - 1] + (i + 1);
			userCell.className = 'cell';
			compCell.className = 'cell';
		}
	}

	refreshOrientations();
	displayShip();
	render();
	refreshListeners();
}

function refreshListeners() {
	// Cell onclick
	let cells = userBoard.getElementsByTagName('td');
	for (i = 0; i < cells.length; i++) {
		// Adds eventListener to all cells
		cells[i].onclick = (e) => {
			let selectedCell = e.target;
			// Searches through ships array
			for (let i = 0; i < ships.length; i++) {
				// Searches through the coords array of each ship
				for (let k = 0; k < ships[i].coords.length; k++) {
					// if selectedCell coords is in the current ship coords, display ship
					if (ships[i].coords[k] == selectedCell.id) {
						currentShip = ships[i];
						displayShip();
					}
				}
			}
		};
	}

	window.onkeydown = (e) => {
		if (e.keyCode === upArrow) {
			arrangeShips('up');
		}
		if (e.keyCode === downArrow) {
			arrangeShips('down');
		}
		if (e.keyCode === leftArrow) {
			arrangeShips('left');
		}
		if (e.keyCode === rightArrow) {
			arrangeShips('right');
		}
	};
}

function arrangeShips(dir) {
	let rowIncrement = 0;
	let colIncrement = 0;

	if (dir == 'up') rowIncrement = -1;
	if (dir == 'down') rowIncrement = 1;
	if (dir == 'left') colIncrement = -1;
	if (dir == 'right') colIncrement = 1;

	// First column coordinate of currentShip
	let firstCoordCol = currentShip.coords[0][0];
	// First row coordinate of currentShip
	let firstCoordRow = currentShip.coords[0].slice(1);

	// Last column coordinate of currentShip
	let lastCoordCol = currentShip.coords.slice(-1).toString()[0];
	// Last row coordinate of currentShip
	let lastCoordRow = currentShip.coords.slice(-1).toString().slice(1);

	// Prevent out of bounds
	if ((firstCoordRow == '1' || lastCoordRow == '1') && dir == 'up') return;
	if ((firstCoordRow == '11' || lastCoordRow == '11') && dir == 'down') return;
	if ((firstCoordCol == 'a' || lastCoordCol == 'a') && dir == 'left') return;
	if ((firstCoordCol == 'k' || lastCoordCol == 'k') && dir == 'right') return;

	// Checks if it is vertical (TRUE) or horizontal (FALSE)
	// by checking if column is same in each coord
	if (currentShip.coords[0][0] == currentShip.coords[1][0]) {
		for (let k = 0; k < currentShip.coords.length; k++) {
			// row increment moves up or down
			// convert to integer, takes row # of coordinate, adds by rowIncrement, then convert to string
			let row = (parseInt(currentShip.coords[k].slice(1)) + rowIncrement).toString();

			// col increment moves right or left
			// index of the column letter in the letters array, adds colIncrement to index
			// then set col to letter[new index]
			let col = letters[letters.indexOf(currentShip.coords[k][0]) + colIncrement];
			currentShip.coords[k] = col + row;

			render();
		}
	} else {
		for (let x = 0; x < currentShip.coords.length; x++) {
			// row is a number
			let row = (parseInt(currentShip.coords[x].slice(1)) + rowIncrement).toString();

			// col is a letter
			let col = letters[letters.indexOf(currentShip.coords[x][0]) + colIncrement];

			currentShip.coords[x] = col + row;

			render();
		}
	}
}

function render() {
	// Clears board
	for (let i = 0; i < 11; i++) {
		for (let k = 1; k < 12; k++) {
			userBoard.getElementsByTagName('tr')[i].getElementsByTagName('td')[k].style.backgroundColor = 'transparent';
		}
	}

	// Display ships according to coordinates
	// Loops through ships array
	for (let m = 0; m < ships.length; m++) {
		// Loops through each ship's coords array
		for (let n = 0; n < ships[m].coords.length; n++) {
			let coord = ships[m].coords[n];
			// col is the index of the letter in the coord
			let col = letters.indexOf(coord[0]) + 1;
			// row is the number after the letter in coord
			let row = coord.slice(1) - 1;
			userBoard.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].style.backgroundColor = '#add8e6';
		}
	}

	checkForOverLap();
}

function appendInstruction(msg, color = 'white') {
	// Clears output if clear is inputted as argument
	if (msg == 'clear') {
		return (logOutput.innerHTML = '');
	}

	// Appends new message
	let newMsg = document.createElement('li');
	newMsg.style.color = color;
	newMsg.innerText = msg;
	logOutput.appendChild(newMsg);

	// Keeps the scroll bar at bottom
	logOutput.scrollTop = logOutput.scrollHeight;
}

function displayShip() {
	// Clears logScreen
	while (logScreen.firstChild) {
		logScreen.firstChild.remove();
	}

	// Header name
	logHeader.innerText = currentShip.name;

	// Creates ship with "spaces" amount of squares
	let createdShip = document.createElement('div');
	for (let i = 0; i < currentShip.space; i++) {
		let square = document.createElement('div');
		square.className = 'square';
		createdShip.appendChild(square);
	}

	createdShip.id = name;
	createdShip.className = 'ship';

	// Set corresponding orientation on display
	if (currentShip.orientation == 'horizontal') {
		createdShip.style.transform = 'rotate(90deg)';
	} else {
		createdShip.style.transform = 'rotate(0deg)';
	}

	// displays ship on logScreen
	logScreen.appendChild(createdShip);
}

function rotate() {
	// Appearance rotation on logScreen
	let screenShip = logScreen.querySelector('.ship');
	// Gets current rotation degree of displayed ship
	let currentRotationDeg = parseInt(screenShip.style.transform.replace('rotate(', '').replace('deg)', ''));
	// Adds 90 deg to currentRotation
	screenShip.style.transform = `rotate(${currentRotationDeg + 90}deg)`;

	// Coordinate rotation
	if (currentShip.orientation == 'horizontal') {
		// First coordinate in array
		let firstCoord = currentShip.coords[0];

		// Col letter of the first coordinate
		let col = firstCoord[0];

		// Row number of first coordinate in integer value
		let row = parseInt(firstCoord.slice(1));

		// Array of values from row to row - length of ship
		let length;

		// Checks if it cannot rotate downwards
		if (parseInt(currentShip.coords[currentShip.coords.length - 1].slice(1)) + currentShip.space > 11) {
			// Rotate Up Vertical From Right Start

			// Array of range of values from start row to end row (Count down)
			length = getRange(row, row - currentShip.space);
		} else {
			// Rotate Down Vertical From Left Start

			// Array of range of values from start row to end row (Count Up)
			length = getRange(row, row + currentShip.space);
		}

		// Assigns new coordinates
		for (i in currentShip.coords) {
			currentShip.coords[i] = col + length[i];
		}

		render();
	} else {
		// If ship orientation is vertical:

		// First coordinate in array
		let firstCoord = currentShip.coords[0];

		// Index value of col letter in first coordinate
		let firstCol = letters.indexOf(firstCoord[0]); // 10

		// Row number of the first coordinate
		let row = firstCoord.slice(1);

		// Array of letters from firstCol to the firstCol + length of ship
		let col = letters.slice(firstCol, firstCol + currentShip.space);

		// Checks if it cannot rotate right
		if (firstCol + currentShip.space > 10) {
			col = letters.slice(firstCol - currentShip.space + 1, firstCol + 1).reverse();
		}

		// Changes each coordinate to col[i] + row
		for (i in currentShip.coords) {
			currentShip.coords[i] = col[i] + row;
		}

		render();
	}

	refreshOrientations();
}

// Creates an array of range of values from start to end (excluding end)
function getRange(start, end) {
	rangeList = [];
	if (end > start) {
		for (let i = start; i < end; i++) {
			rangeList.push(i);
		}
	} else {
		for (let k = start; k > end; k--) {
			rangeList.push(k);
		}
	}

	return rangeList;
}

function refreshOrientations() {
	// Loops through ships array
	for (let i = 0; i < ships.length; i++) {
		// first coordinate of that ship
		let first = ships[i].coords[0];
		// second coordinate of that ship
		let second = ships[i].coords[1];
		// if letter of first == letter of second, its in the same column, therefore veritcal, otherwise, horizontal
		if (first[0] == second[0]) {
			ships[i].orientation = 'vertical';
		} else {
			ships[i].orientation = 'horizontal';
		}
	}
}

// Returns number of times a value appears in an array
function getOccurrence(arr, value) {
	return arr.filter((v) => v === value).length;
}

function checkForOverLap() {
	let overlap = false;
	// coordinates is an array of all the coordinates of ALL ships
	let coordinates = totalCoords();
	// loops through each coordinate in array
	coordinates.forEach((coord) => {
		// if the same coordinate occurs more than once:
		if (getOccurrence(coordinates, coord) > 1) {
			overlap = true;
			let col = letters.indexOf(coord[0]) + 1; // 1
			let row = coord.slice(1) - 1; // 4

			// loops through userboard and assigns that coordinate a red background color to indicate illegal overlap
			for (let i = 0; i < 11; i++) {
				for (let j = 1; j < 12; j++) {
					if (i == row && j == col) {
						userBoard.getElementsByTagName('tr')[i].getElementsByTagName('td')[j].style.backgroundColor =
							'lightcoral';
					}
				}
			}
		}
	});
	return overlap;
}

function startGame() {
	if (checkForOverLap()) {
		return alert('Ships are overlapping. Please reconfigure your battlefield');
	}

	// Disables all rearrangement of ships
	let cells = userBoard.getElementsByTagName('td');
	for (let m = 0; m < cells.length; m++) {
		window.onkeydown = (e) => {
			if (e.keyCode === upArrow || e.keyCode === downArrow || e.keyCode === rightArrow || e.keyCode === leftArrow)
				return;
		};
	}

	// Disables button usage
	let rotateBtn = document.getElementById('rotate-btn');
	let startBtn = document.getElementById('start-btn');
	rotateBtn.onclick = () => {
		return alert('Game has started!');
	};
	startBtn.onclick = () => {
		return alert('Game has started!');
	};

	appendInstruction('clear');
	appendInstruction('Game Started!', 'lightgreen');
	appendInstruction("Fire torpedos at your opponent's ship by clicking on any coordinate.");

	compBoardClickable('enable');
}

function playerTurn(e) {
	let selectedCell = e.target;
	let selectedCoord = e.target.id;

	// Checks if coordinate has already been clicked
	if (selectedCell.style.backgroundColor == 'red' || selectedCell.style.backgroundColor == 'white') {
		return appendInstruction('You have already launched a torpedo here.');
	}

	// Checks for hit or miss
	for (let i = 0; i < compShips.length; i++) {
		for (let k = 0; k < compShips[i].coords.length; k++) {
			if (compShips[i].coords[k] == selectedCoord) {
				// Player keeps going if hit
				hit(compBoard, selectedCoord, compShips);
				return checkForWin();
			}
		}
	}
	miss(compBoard, selectedCoord);
	// Disables player from clicking compBoard
	compBoardClickable('disable');

	// Computer turn if miss
	return setTimeout(compTurn, 500);
}

var allCoordinates = generateAllPossibleCoordinates();

// Last coordinate that computer hit
var lastHitCoord = {
	coord: '',
	random: true,
	currentDir: 0
};

function getPredictedCoordinate(coord, dir) {
	let rowInt = 0;
	let colInt = 0;
	if (dir == 'up') colInt = -1;
	if (dir == 'down') colInt = 1;
	if (dir == 'right') rowInt = 1;
	if (dir == 'left') rowInt = -1;

	let row = letters[letters.indexOf(coord[0]) + rowInt];
	let col = parseInt(coord.slice(1)) + colInt;
	return row + col;
}

var directions = [ 'left', 'up', 'right', 'down' ];

function compTurn() {
	if (lastHitCoord.random) {
		// Gets random coordinate from allCoordinates
		let rndCoord = allCoordinates[getRandomInteger(0, allCoordinates.length - 1)];
		console.log('Comp randomly hit: ' + rndCoord);

		// Removes that value from list so it doesn't get called on again
		allCoordinates.splice(allCoordinates.indexOf(rndCoord), 1);

		// If coordinate is a ship, indicate hit, then run compTurn again
		for (let i = 0; i < ships.length; i++) {
			if (ships[i].coords.includes(rndCoord)) {
				hit(userBoard, rndCoord, ships);
				lastHitCoord.coord = rndCoord;
				lastHitCoord.random = false;

				// If no one won, computer goes again
				if (!checkForWin()) return setTimeout(compTurn, 500);
				else
					// Else if someone won, disable click
					return compBoardClickable('disable');
			}
		}

		// Enables player to click compBoard
		compBoardClickable('enable');
		return miss(userBoard, rndCoord);
	}

	if (lastHitCoord.currentDir == 4) {
		lastHitCoord.currentDir = 0;
		lastHitCoord.random = true;
	}

	// Checks if predicted coord is out of bounds, if so, iterate to next direction
	if (getPredictedCoordinate(lastHitCoord.coord, directions[lastHitCoord.currentDir]) == NaN) {
		lastHitCoord.currentDir++;
		compTurn();
	}

	let target = getPredictedCoordinate(lastHitCoord.coord, directions[lastHitCoord.currentDir]);

	// If target is not in allCoordinates array, randomize attack
	if (!allCoordinates.includes(target)) {
		console.log('TARGET NOT IN COORDINATE LIST: ' + target);
		lastHitCoord.random = true;
		return compTurn();
	}

	// Removes that value from list so it doesn't get called on again
	allCoordinates.splice(allCoordinates.indexOf(target), 1);

	console.log('Comp predicted hit: ' + target);

	// If coordinate is a ship, indicate hit, then run compTurn again
	for (let i = 0; i < ships.length; i++) {
		if (ships[i].coords.includes(target)) {
			hit(userBoard, target, ships);
			lastHitCoord.coord = target;

			// If the ship is completely sunk, turn on random attacks
			if (ships[i].dead) {
				lastHitCoord.random = true;
			} else {
				lastHitCoord.random = false;
			}

			// If no one won, computer goes again
			if (!checkForWin()) return setTimeout(compTurn, 500);
			else
				// Else if someone won, disable click
				return compBoardClickable('disable');
		}
	}

	// If miss, iterate to next direction
	lastHitCoord.currentDir++;
	// Enables player to click compBoard
	compBoardClickable('enable');
	return miss(userBoard, target);
}

function compBoardClickable(toggle) {
	let compCell = compBoard.querySelectorAll('.cell');
	for (let i = 0; i < compCell.length; i++) {
		if (toggle == 'disable') {
			compCell[i].removeEventListener('click', playerTurn);
		} else if (toggle == 'enable') {
			compCell[i].addEventListener('click', playerTurn);
		}
	}
}

function generateAllPossibleCoordinates() {
	// Generates a list of all possible coordinates
	let coordinates = [];
	for (let i = 0; i < letters.length; i++) {
		for (let k = 1; k <= 11; k++) {
			coordinates.push(letters[i] + k);
		}
	}
	return coordinates;
}

function hit(board, coordinate, shipList) {
	console.log('HIT @ ' + coordinate);
	let row = coordinate.slice(1) - 1;
	let col = letters.indexOf(coordinate[0]) + 1;

	// Changes background color of that coordinate to indicate hit
	board.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].style.backgroundColor = 'red';

	// Checks if ship is fully sunk, else increase hit counter
	for (let i = 0; i < shipList.length; i++) {
		// if shipList includes the targeted coordinate
		if (shipList[i].coords.includes(coordinate)) {
			// if the hit counter equals length of the ship - 1
			if (shipList[i].hit == shipList[i].space - 1) {
				// Change dead status to true
				shipList[i].dead = true;

				console.log(shipList[i].name + ' has been sunk!');

				// If computer sank user's ship
				if (board === userBoard) {
					return appendInstruction(`Your ${shipList[i].name} has sunk!`, 'red');
				} else {
					// If user sank computer's ship
					return appendInstruction(`Opponent ${shipList[i].name} has sunk!`, 'green');
				}
			} else {
				// If ship hit but not fully sunk
				shipList[i].hit++;
				console.log(shipList[i].name + ' has been hit ' + shipList[i].hit + ' times');

				// If computer ship has been hit
				if (shipList == compShips) {
					appendInstruction('An enemy ship has been hit!', 'lightcoral');
				} else {
					// else if user ship has been hit
					appendInstruction('Your ship has been hit!', 'lightcoral');
				}
			}
		}
	}
}

function miss(board, coordinate) {
	let row = coordinate.slice(1) - 1;
	let col = letters.indexOf(coordinate[0]) + 1;

	// Changes background color of that coordinate to indiciate miss
	board.getElementsByTagName('tr')[row].getElementsByTagName('td')[col].style.backgroundColor = 'white';

	if (board == userBoard) {
		appendInstruction('Opponent missed!');
	} else {
		appendInstruction('You missed!');
	}
}

function getRandomInteger(lower, upper) {
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;

	return rnd;
}

function checkForWin() {
	let userDead = 0;
	let compDead = 0;

	// Loops through user and comp ships to see if all "dead" = true
	for (let i = 0; i < ships.length; i++) {
		if (ships[i].dead == true) {
			userDead++;
		}
		if (compShips[i].dead == true) {
			compDead++;
		}
	}

	if (userDead == 5 || compDead == 5) {
		compBoardClickable('disable');
		appendInstruction('clear');

		if (userDead == 5) {
			appendInstruction('You have been defeated by your opponent!', 'lightcoral');
			return true;
		} else {
			appendInstruction('Congratulations you have defeated your opponent!', 'lightgreen');
			return true;
		}
	}
}
