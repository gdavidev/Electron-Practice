export default class ShowResultsGameState {
  constructor(requestGameState, configuration, state) {
    this.finalResultDialogElement = document.getElementById('final-result-dialog');
    this.finalResultTextElement = document.getElementById('final-result-text');
    this.finalResultScoreElement = document.getElementById('final-result-score-text');
    this.tryAgainButtonElement = document.getElementById('try-again-button');
    
    this.autoQuitTimeoutRef = null;
    this.requestGameState = requestGameState;
    this.configuration = configuration;
    this.state = state;
    
    this.tryAgainButtonElement.onclick = () => { requestGameState('main-menu') }
  }
  
  enter(from) {
    const maxScore = this.configuration.timePerQuestionMs * this.configuration.scoreMultiplier;
    const scoreRatio = this.state.score / maxScore;
    
    if (scoreRatio >= 0.7) {
      this.finalResultTextElement.textContent = 'Parabens'
      this.finalResultTextElement.style.color = 'green'
    } else if (scoreRatio >= 0.5) {
      this.finalResultTextElement.textContent = 'Você foi bem'
      this.finalResultTextElement.style.color = 'orange'
    } else {
      this.finalResultTextElement.textContent = 'Mais sorte na próxima'
      this.finalResultTextElement.style.color = 'red'
    }
    
    this.finalResultDialogElement.style.display = 'block';
    this.finalResultScoreElement.textContent = String(this.state.score);
    
    this.autoQuitTimeoutRef = setTimeout(() => {
      this.requestGameState('main-menu');
    }, this.configuration.goToMenuOnInactivityInResultScreenInSec * 1000)
  }
  
  exit(to) {
    this.finalResultDialogElement.style.display = 'none';
    
    clearTimeout(this.autoQuitTimeoutRef)
    this.autoQuitTimeoutRef = null
  }
}