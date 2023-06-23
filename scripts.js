let gameSpace = ["", "", "", "", "", "", "", "", ""];
// empty array with 9 spaces to represent our play board

const playComputerButton = document.getElementById("play-ai")
// select play vs Comp button
const gameboard = document.querySelector(".gameboard");
// initializing the gameboard variable
const resetButton = document.getElementById("reset-button");
// initializing the reset button
let gameOver = false;
// need a global boolean variable I can easily access for the purposes of making the game
// inoperable when one player wins until someone hits reset
const playerFactory = (number, marker) => {
  const getPlayerNumber = () => number;
  const getPlayerMarker = () => marker;

  return { getPlayerNumber, getPlayerMarker };
};
// player creator factory function

const player1 = playerFactory(1, "O");
const player2 = playerFactory(2, "X");
const computerPlayer = playerFactory(2, "X")
// establishing our players
let playAgainstComputer = false
// default setting for playing vs a computer will be set to false until the button is pressed

let currentPlayer = player1;
// establishing currentplayer, as a kid I always played with the rule 'O's goes first'

const checkWinningCondition = () => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  // winning combos in tic tac toe
  for (let i = 0; i < winningCombinations.length; i++) {
    const combination = winningCombinations[i];
    const a = combination[0];
    const b = combination[1];
    const c = combination[2];

    if (
      gameSpace[a] !== "" &&
      gameSpace[a] === gameSpace[b] &&
      gameSpace[a] === gameSpace[c]
    ) {
      const message = document.getElementById("message");
      message.textContent =
        "Player " + currentPlayer.getPlayerNumber() + " wins!";
      gameOver = true;
      return true;
    }
  }
};

gameboard.addEventListener("click", function (event) {
  if (gameOver || (!playAgainstComputer && currentPlayer === computerPlayer)) {
    return;
  }
  const clickedElement = event.target;
  if (clickedElement.classList.contains("gamespace")) {
    const index = Number(clickedElement.id.split("-")[1]) - 1;
    if (gameSpace[index] === "") {
      gameSpace[index] = currentPlayer.getPlayerMarker();
      clickedElement.textContent = currentPlayer.getPlayerMarker();
      console.log("Clicked gamespace:", clickedElement.id);
      console.log("Game board state:", gameSpace);

      if (checkWinningCondition()) {
        return;
      }
    
      if (playAgainstComputer && currentPlayer === player1) {
        currentPlayer = computerPlayer;
        makeComputerMove();
      } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    }
  }
});
// my eventlistener that runs when the gamespace is clicked. Listens for a click and targets the
// element clicked, puts that target in a variable, identifies it by its number, seperates its name
// from its number in with the split method (which splits it into two arrays)
// grabs JUST the number with index[1], converts the number from string to an actual number
// 'ie splitting "gamespace-2" at the hyphen "-" will turn it into two arrays: ["gamespace"], and
// ["2"] so we grab the ["2"] part and turn it into a number 2. Then we adjust that value for 0-based
// indexing. Finally, put whatever that array is into a variable "index", which we check against
// our global array "gameSpace". If index matches an empty string value for gameSpace, we change
// gameSpace at that index to match currentPlayer's marker type with currentPlayer.getPlayerMarker()
// and we also change the textContent inside to match. we then change currentplayer from whichever
// player it was to the other player with a simple ternery operator
resetButton.addEventListener("click", function () {
  gameSpace = ["", "", "", "", "", "", "", "", ""];
  const gameSpaces = document.querySelectorAll(".gamespace");
  gameSpaces.forEach((space) => {
    space.textContent = "";
  });
  currentPlayer = player1;
  gameOver = false;
  const message = document.getElementById("message");
  message.textContent = "";
});
// EL that listens for a click on resetButton, and simply resets gameSpace back to its original
// index value, and also initializes a new variable gameSpaces which runs querySelectorAll on
// everything with a class of .gamespace. This is convenient because it puts all of our gamespaces
// into an index which allows us to run a forEach method on them, passing space through as an
// argument so that we can modify the textcontent of every gamespace to return them to empty strings.
// I reset the currentPlayer value to player1, because in my day player1 always goes first.
// also changed gameOver back to false so that the game can be played again
playComputerButton.addEventListener("click", function () {
  playAgainstComputer = true;
  currentPlayer = player1;
  message.textContent = "Playing against the computer. Your turn!";
});
const makeComputerMove = () => {
  const emptySpaces = gameSpace.reduce((indices, value, index) => {
    if (value === "") {
      indices.push(index);
    }
    return indices;
  }, []);

  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const computerMove = emptySpaces[randomIndex];

  gameSpace[computerMove] = computerPlayer.getPlayerMarker();
  const computerSpace = document.getElementById(`gamespace-${computerMove + 1}`);
  computerSpace.textContent = computerPlayer.getPlayerMarker();

  if (checkWinningCondition()) {
    return;
  }

  currentPlayer = player1;
};