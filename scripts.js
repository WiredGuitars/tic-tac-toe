let gameBoard = () => {
    
}
const gameboard = document.querySelector('.gameboard');

gameboard.addEventListener('click', function(event) {
  const clickedElement = event.target;
  
  if (clickedElement.classList.contains('gamespace')) {
    // Perform your logic for the clicked gamespace here
    console.log('Clicked gamespace:', clickedElement.id);
  }
});
