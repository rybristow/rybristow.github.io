var executed = false;
var gameStarted = false;
var gameOver = false;
var gameBoard = [[false, false, false],[false, false, false],[false, false, false]];
var letCompButton;
var resetButton;

const WIN = 0;
const BLOCK = 1;
const POSITION = 2;

const HTMLX = '<img src="ticTacToe_X.png height="90" width="90">'
const HTMLO = '<img src="ticTacToe_O.png height="90" width="90">'

var onload = function(){
	if(!executed)	{
		var container = document.getElementById("buttons");
		// Setup the game board
		for(var i = 0; i < gameBoard.length; i++)	{
			for(var j = 0; j < gameBoard[i].length; j++)	{
				gameBoard[i][j] = {
					value: false,
					domNode: document.createElement("button")
				};
				gameBoard[i][j].domNode.id = "button$(x).$(y)";
				gameBoard[i][j].domNode.style.width = '100';
				gameBoard[i][j].domNode.style.height = '100';
				gameBoard[i][j].domNode.innerHTML = "-";
				gameBoard[i][j].domNode.onclick = userMove.bind(null,i,j);
				gameBoard[i][j].domNode.disabled = false;
				container.appendChild(gameBoard[i][j].domNode);
			}
			var br = document.createElement("br");
			container.appendChild(br);
		}
		executed = true;	// Page has loaded

		// Setup button to let computer go first
		letCompButton = {
			value: false,
			domNode: document.createElement("button")
		};
				letCompButton.domNode.id = "letCompButton";
		letCompButton.domNode.style.width = '150';
		letCompButton.domNode.style.height = '50';
		letCompButton.domNode.innerHTML = "Let the Computer go first";
		letCompButton.domNode.onclick = letCompGo.bind(null);
		container.appendChild(letCompButton.domNode);

		// Setup button to reset the game
		resetButton = {
			value: false,
			domNode: document.createElement("button")
		};
		resetButton.domNode.id = "resetButton";
		resetButton.domNode.style.width = '150';
		resetButton.domNode.style.height = '50';
		resetButton.domNode.innerHTML = "Reset Game";
		resetButton.domNode.onclick = resetGame;
		resetButton.domNode.onclick = resetGame.bind(null);
		container.appendChild(resetButton.domNode);
	}
}

window.addEventListener("load", onload);

var userMove = function(x,y) {
	gameStarted = true;
	if(!gameOver)	{
		//Mark the user's move
		gameBoard[x][y].domNode.innerHTML = "X";
		gameBoard[x][y].value = 'X';
		gameBoard[x][y].domNode.disabled = true;

		//Check for win
		if(testWinConditions('X') == false)	{
			console.log("Win conditions false. Computer Move");
			computerMove();
		}
		else	{
			console.log("Win conditions true. User wins");
			document.getElementById("instructions").innerHTML = "You Win!!!";
		}
	}
}

var computerMove = function()	{
	gameStarted = true;

	// Check to see if there are any available moves
	var tempArray = [];
	tempArray = findNextMove();
	console.log("tempArray" + tempArray);
	// No moves available
	if(tempArray.length == 0)	{
		gameOver = true;
		console.log("Nobody wins");
		document.getElementById("instructions").innerHTML = "Nobody wins!";
		return;
	}
	else	{
		// Mark the computer's move
		gameBoard[tempArray[0]][tempArray[1]].value = 'O';
		gameBoard[tempArray[0]][tempArray[1]].domNode.innerHTML = "O";
		gameBoard[tempArray[0]][tempArray[1]].domNode.disabled = true;

		// Check for win
		if(testWinConditions('O') == false)	{
			//Check to see if cats game
			if(tempArray.length == 0)	{
				gameOver = true;
				console.log("Nobody wins");
				document.getElementById("instructions").innerHTML = "Nobody wins!";
				return;
			}
			else
				console.log("Win conditions false. User Move");
		}
		else	{
			console.log("Win conditions true. Computer wins");
			document.getElementById("instructions").innerHTML = "Computer Wins!!!";
		}
	}
}

var disableAllButtons = function()	{
	for(var i = 0; i < gameBoard.length; i++)	{
		for(var j = 0; j < gameBoard[i].length; j++)	{
			// gameBoard[i][j].value = false;
			gameBoard[i][j].domNode.disabled = true;
		}
	}
}


var testWinConditions = function(symbol)	{
	var temp = true;
	//Check all horizontals
	for(var i = 0; i < gameBoard.length; i++)	{
		if(gameBoard[i][0].value == symbol && gameBoard[i][1].value == symbol && gameBoard[i][2].value == symbol)	{
			disableAllButtons();
			return true;
		}
	}
	// Check all verticals
	for(var i = 0; i < gameBoard.length; i++)	{
		if(gameBoard[0][i].value == symbol && gameBoard[1][i].value == symbol && gameBoard[2][i].value == symbol)	{
			disableAllButtons();
			return true;
		}
	}
	//Check forward diagonal
	if(gameBoard[0][0].value == symbol && gameBoard[1][1].value == symbol && gameBoard[2][2].value == symbol)	{
			disableAllButtons();
			return true;
	}
	//Check backward diagonal
	if(gameBoard[0][2].value == symbol && gameBoard[1][1].value == symbol && gameBoard[2][0].value == symbol)	{
			disableAllButtons();
			return true;
	}

	return false;
}

var findNextMove = function()	{
	//Make an array of open spaces
	var openSpaces = [];
	for(var i = 0; i < gameBoard.length; i++)	{
		for(var j = 0; j < gameBoard[i].length; j++)	{
			if(gameBoard[i][j].domNode.disabled == false)	{
				var tempArray = [0, 0];
				tempArray[0] = i;
				tempArray[1] = j;
				openSpaces.push(tempArray);
			}
		}
	}

	if(openSpaces.length == 0) {
		return [];
	}

	// First, check if there is a winning move
	var index = checkForCondition(openSpaces, WIN);
	// Otherwise, check for blocking moves
	if(index == -1) {
		index = checkForCondition(openSpaces, BLOCK);
	}
	if(index == -1) {
		index = checkForCondition(openSpaces, POSITION);
	}
	// If no winning or blocking moves,
	if(index == -1) {
		// Pick a random legal move to make and return the indices
		index = Math.floor(Math.random() * (openSpaces.length));
	}
	return openSpaces[index];
}

Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    }
});

var checkForCondition = function(openSpaces, conditionCode) {
	// for(var i = 0; i < gameBoard.length; i++) {
	// 	console.log("|" + gameBoard[i][0].value +
	// 		"|" + gameBoard[i][1].value +
	// 		"|" + gameBoard[i][2].value + "|");
	// }
	
	var matchingMoves = [];
	for (var i = 0; i < openSpaces.length; i++) {
		var pos = openSpaces[i];
		// console.log("Open space: (" + pos[0] + ", " + pos[1] + ")");

		var validRows = [];
		var newRowV = [];
		for(var m = 0; m < 3; m++) {
			var newRowH = [];
			newRowV.push([m, pos[1]]);
			for(var n = 0; n < 3; n++) {
				newRowH.push([pos[0], n]);
			}
			// console.log("valid row: " + newRowH[0] + "|" + newRowH[1] + "|" + newRowH[2]);
			validRows.push(newRowH);
		}
		validRows.push(newRowV);

		// pos is on / diagonal
		if(pos[0] + pos[1] == 2) {
			validRows.push([[0,2], [1,1], [2,0]]);
		}

		// pos is on \ diagonal
		if(pos[0] == pos[1]) {
			validRows.push([[0,0], [1,1], [2,2]]);
		}

		// for(var possibleRow in validRows) {
		// 	console.log("PossibleRow: " + possibleRow[0] + possibleRow[1] + possibleRow[2] );
		// }
		// console.log("Number of possible rows: " + validRows.length);
		for(var m = 0; m < validRows.length; m++) {
			// console.log("Possible Row: " + validRows[m][0] + "," + validRows[m][1] + "," + validRows[m][2] + ")");
			// console.log("fist space in row: (" + validRows[m][0][0] + "," + validRows[m][0][1] + ")");

			var rowValues = [gameBoard[validRows[m][0][0]][validRows[m][0][1]].value, gameBoard[validRows[m][1][0]][validRows[m][1][1]].value, gameBoard[validRows[m][2][0]][validRows[m][2][1]].value];

			// console.log("Possible Row values: (" + rowValues[0] + "," + rowValues[1] + "," + rowValues[2] + ")");

			switch(conditionCode) {
				case WIN:
					if(rowValues.count('O') == 2 && rowValues.count(false) == 1) {
						matchingMoves.push(i);
					}
					break;
				case BLOCK:
					if(rowValues.count('X') == 2 && rowValues.count(false) == 1) {
						matchingMoves.push(i);
					}
					break;
				case POSITION:
					if(rowValues.count('O') == 1 && rowValues.count(false) == 2) {
						matchingMoves.push(i);
					}
					break;
				default:
					console.log("Weird condition code");
			}
			// console.log("Row has " + rowValues.count('O') + " O's and " + rowValues.count(false) + " empty spaces");
			// if(rowValues.count('O') == 2 && rowValues.count(false) == 1) {
			// 		console.log("Pushed row");
			// 			matchingMoves.push(i);
			// 		}
		}

		// var matchingMoves = validRows.filter(x => (x.count('O') == 2 && x.count(false) == 1));
	}

	if(matchingMoves.length > 0) {
		switch(conditionCode) {
			case WIN:
				console.log("VICTORY IS MINE");
				break;
			case BLOCK:
				console.log("NOT IN MY HOUSE");
				break;
			case POSITION:
				console.log("PREPARING FOR THE KILL...");
			default:
				console.log("Not sure what happened");
		}
		// Get random element from matchingMoves
		var chosenMove = matchingMoves[Math.floor(Math.random() * (matchingMoves.length))];
		// Return index of a matching move in matchingMoves
		return chosenMove;
	}

	console.log("no matching moves :(");
	// No matching moves
	return -1;
}

// Let the computer make a move to start the game
var letCompGo = function()	{
	if(!gameStarted)	{
		computerMove();
	}
}

// Reset the game
var resetGame = function()	{
	for(var i = 0; i < gameBoard.length; i++)	{
		for(var j = 0; j < gameBoard[i].length; j++)	{
			gameBoard[i][j].domNode.disabled = false;
			gameBoard[i][j].value = false;
			gameBoard[i][j].domNode.innerHTML = '-';
			gameStarted = false;
			gameOver = false;
			document.getElementById("instructions").innerHTML = "Go first or choose to let the computer go first.";
		}
	}
}
