export default class MainMenuGameState {
  constructor(requestGameState, state) {
    this.startGameButton = document.getElementById('start-game-btn');
    this.exitGameButton = document.getElementById('exit-game-btn');
    this.mainMenuContainer = document.getElementById('main-menu-container');
    this.scoreElement = document.getElementById('score');
    
    this.state = state;
    this.requestGameState = requestGameState;

    this.exitGameButton.onclick = () => window.close();
    this.startGameButton.onclick = () => requestGameState('form');
  }
  
  enter(from) {
    this.#showMenu();
    this.#resetGame();

    document.onkeydown = (e) => {
      if (e.key === 'Enter')
        this.requestGameState('admin')
    };
  }
  
  exit(to) {
    this.#hideMenu();
    document.onkeydown = undefined
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