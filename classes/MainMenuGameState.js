export default class MainMenuGameState {
  constructor(requestGameState, state) {
    this.startGameButton = document.getElementById('start-game-btn');
    this.exitGameButton = document.getElementById('exit-game-btn');
    this.mainMenuContainer = document.getElementById('main-menu-container');
    this.scoreElement = document.getElementById('score');
    
    this.state = state;
    
    this.exitGameButton.onclick = () => window.close();
    this.startGameButton.onclick = () => { requestGameState('questions') }
  }
  
  enter(from) {
    this.#showMenu();
    this.#resetGame();
  }
  
  exit(to) {
    this.#hideMenu();
  }
  
  #showMenu() {
    this.mainMenuContainer.classList.remove('hidden');
  }
  
  #hideMenu() {
    this.mainMenuContainer.classList.add('hidden');
  }
  
  #resetGame() {
    this.state.currentQuestion = 0;
    this.state.score = 0
    this.scoreElement.textContent = '0'
  }
}