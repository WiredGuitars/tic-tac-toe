let gameSpace = ["", "", "", "", "", "", "", "", ""];
// empty array with 9 spaces to represent our play board

const gameboard = document.querySelector(".gameboard");
// initializing the gameboard variable
const resetButton = document.getElementById("reset-button")

const playerFactory = (number, marker) => {
  const getPlayerNumber = () => number;
  const getPlayerMarker = () => marker;

  return { getPlayerNumber, getPlayerMarker };
};
// player creator factory function

const player1 = playerFactory(1, "O");
const player2 = playerFactory(2, "X");
// establishing our players

let currentPlayer = player1;
// establishing currentplayer, as a kid I always played with the rule 'O's goes first'

const checkWinningCondition = () => {
    
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    // winning combos in tic tac toe
    // Check each winning combination
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (gameSpace[a] !== "" && gameSpace[a] === gameSpace[b] && gameSpace[a] === gameSpace[c]) {
        // A winning condition is met
        console.log(`Player ${currentPlayer.getPlayerNumber()} wins!`);
        // Perform any additional actions you want when a player wins
        return true;
      }
    }

    // No winning condition is met
    return false;
};
//factory function for checking the win condition

gameboard.addEventListener("click", function (event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("gamespace")) {
    const index = Number(clickedElement.id.split("-")[1]) - 1;
    if (gameSpace[index] === "") {
      gameSpace[index] = currentPlayer.getPlayerMarker();
      clickedElement.textContent = currentPlayer.getPlayerMarker();
      console.log("Clicked gamespace:", clickedElement.id);
      console.log("Game board state:", gameSpace);

    
    if (checkWinningCondition()) {
        // Game over, a player has won
        // Add your game over logic here
        return;
    }
    

      currentPlayer = currentPlayer === player1 ? player2 : player1;
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
resetButton.addEventListener("click", function(){
    gameSpace = ["", "", "", "", "", "", "", "", ""];
    const gameSpaces = document.querySelectorAll(".gamespace");
    gameSpaces.forEach((space) => {
      space.textContent = "";
    });    
    currentPlayer = player1
})
// EL that listens for a click on resetButton, and simply resets gameSpace back to its original
// index value, and also initializes a new variable gameSpaces which runs querySelectorAll on
// everything with a class of .gamespace. This is convenient because it puts all of our gamespaces
// into an index which allows us to run a forEach method on them, passing space through as an 
// argument so that we can modify the textcontent of every gamespace to return them to empty strings.
// I reset the currentPlayer value to player1, because in my day player1 always goes first.