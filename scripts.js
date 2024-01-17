let gameSpace = ["", "", "", "", "", "", "", "", ""];
// empty array with 9 spaces to represent our play board
const playImpossibleButton = document.getElementById("play-impossible-button");
// select impossible computer button
const playComputerButton = document.getElementById("play-ai");
// select play vs Comp button
const gameboard = document.querySelector(".gameboard");
// initializing the gameboard variable
const resetButton = document.getElementById("reset-button");
const message = document.getElementById("message");

// initializing the reset button
let gameOver = false;
let impossibleMode = false;
// need a global boolean variable I can easily access for the purposes of making the game
// inoperable when one player wins until someone hits reset/playvscomp/playvshuman
const playerFactory = (string, marker) => {
  const getPlayerNumber = () => string;
  const getPlayerMarker = () => marker;

  return { getPlayerNumber, getPlayerMarker };
};
// player creator factory function
const player1 = playerFactory("1", "O");
const player2 = playerFactory("2", "X");
const computerPlayer = playerFactory("computer", "X");
// establishing our players
let playAgainstComputer = false;
// default setting for playing vs a computer will be set to false until the button is pressed
let computerHasMoved = false;
// see above, same logic
let currentPlayer = player1;
// establishing currentplayer, as a kid I always played with the rule 'O's goes first', so
// so player1 will be 'O's' and they will go first

const makeComputerMove = () => {
  if (playAgainstComputer && currentPlayer === computerPlayer) {
    if (checkTie() === true) {
      gameOver = true;
      return;
    }
    if (impossibleMode) {
      const bestMove = minimax(gameSpace, 0, true);

      gameSpace[bestMove] = computerPlayer.getPlayerMarker();
      const computerSpace = document.getElementById(
        `gamespace-${bestMove + 1}`
      );

      if (computerSpace) {
        computerSpace.textContent = computerPlayer.getPlayerMarker();
      } else {
        console.error("Computer Space is null or undefined");
      }

      if (checkWinningCondition(gameSpace, computerPlayer) === 1) {
        message.textContent = "The computer has won!";
        gameOver = true;
        return;
      }
    } else {
      // Existing logic for easy computer move
      const availableMoves = getAvailableMoves(gameSpace);
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const computerMove = availableMoves[randomIndex];

      gameSpace[computerMove] = computerPlayer.getPlayerMarker();
      const computerSpace = document.getElementById(
        `gamespace-${computerMove + 1}`
      );
      computerSpace.textContent = computerPlayer.getPlayerMarker();
      checkTie();

      if (checkWinningCondition(gameSpace, computerPlayer) === 1) {
        message.textContent = "The computer has won!";
        gameOver = true;
        return;
      }
    }
  }

  currentPlayer = player1;
};

const minimax = (board, depth, isMaximizing) => {
  const winner = checkWinningCondition(board, computerPlayer);
  const availableMoves = getAvailableMoves(board);

  if (winner === 1) {
    return 100 - depth; // Adjust the score based on depth
  } else if (winner === -1) {
    return depth - 100; // Adjust the score based on depth
  } else if (availableMoves.length === 0) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = "X"; // Assuming computer always plays with 'X'
      let score = minimax(newBoard, depth + 1, false); // Switch to minimizing

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return depth === 0 ? bestMove : bestScore;
  } else {
    let bestScore = Infinity;
    let bestMove = -1;

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = "O"; // Assuming player always plays with 'O'
      let score = minimax(newBoard, depth + 1, true); // Switch to maximizing

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return depth === 0 ? bestMove : bestScore;
  }
};

const getAvailableMoves = (board) => {
  return board.reduce((moves, value, index) => {
    if (value === "") {
      moves.push(index);
    }
    return moves;
  }, []);
};

const checkWinningCondition = (gameSpace, currentPlayer) => {
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
      if (gameSpace[a] === currentPlayer.getPlayerMarker()) {
        return 1; // Indicate that the current player wins
      } else {
        return -1; // Indicate that the opponent wins
      }
    }
  }

  return 0; // No winning condition found
};

gameboard.addEventListener("click", function (event) {
  if (gameOver) {
    return;
  }
  const clickedElement = event.target;
  const index = clickedElement.id.split("-")[1] - 1;

  if (gameSpace[index] === "") {
    gameSpace[index] = currentPlayer.getPlayerMarker();
    message.textContent = "";

    clickedElement.textContent = currentPlayer.getPlayerMarker();
    if (checkWinningCondition(gameSpace, currentPlayer) === 1) {
      message.textContent = `Player ${currentPlayer.getPlayerNumber()} has won the game!`;
      gameOver = true;
      return;
    }
    if (playAgainstComputer && currentPlayer === player1) {
      currentPlayer = computerPlayer;
      makeComputerMove();
    } else {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    if (checkTie()) {
      message.textContent = "It's a tie!";
      gameOver = true;
      return;
    }
  }
});

const checkTie = () => {
  return gameSpace.every((value) => value !== "");
};

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
// player it was to the other player with a simple ternery operator. refactored to also determine game state as checkwinningcondition needed to be kept pure for impossible computer's use of minimax
resetButton.addEventListener("click", function () {
  resetGameState();
});

playImpossibleButton.addEventListener("click", function () {
  playAgainstComputer = true;
  impossibleMode = true; // Toggle the impossibleMode
  currentPlayer = player1;
  message.textContent = "You've entered the lion's den, good luck!";
  resetGameState();
});

playComputerButton.addEventListener("click", function () {
  playAgainstComputer = true;
  impossibleMode = false;
  currentPlayer = player1;
  message.textContent = "Playing against the computer. Your turn!";
  resetGameState();
});

const playHumanButton = document.getElementById("play-human-button");
playHumanButton.addEventListener("click", function () {
  playAgainstComputer = false;
  computerHasMoved = false;
  message.textContent = "Playing against another Human, my bet is on them";
  resetGameState();
});

const resetGameState = () => {
  currentPlayer = player1;
  gameSpace = ["", "", "", "", "", "", "", "", ""];
  const gameSpaces = document.querySelectorAll(".gamespace");
  gameSpaces.forEach((space) => {
    space.textContent = "";
  });
  gameOver = false;
  computerHasMoved = false;
};
