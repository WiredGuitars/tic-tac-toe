let gameSpace = ["", "", "", "", "", "", "", "", ""];
//empty array with 9 spaces to represent our play board

const gameboard = document.querySelector(".gameboard");
//initializing the gameboard variable

const playerFactory = (number, marker) => {
  const getPlayerNumber = () => number;
  const getPlayerMarker = () => marker;

  return { getPlayerNumber, getPlayerMarker };
};
//player creator factory function

const player1 = playerFactory(1, "O");
const player2 = playerFactory(2, "X");
//establishing our players, I always played the game as a kid with the player with 'O' as player1

let currentPlayer = player1;
//establishing currentplayer, as a kid I always played with the rule 'O goes first'

gameboard.addEventListener("click", function (event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("gamespace")) {
    const index = Number(clickedElement.id.split("-")[1]) - 1;
    if (gameSpace[index] === "") {
      gameSpace[index] = currentPlayer.getPlayerMarker();
      clickedElement.textContent = currentPlayer.getPlayerMarker();
      console.log("Clicked gamespace:", clickedElement.id);
      console.log("Game board state:", gameSpace);

      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  }
});

