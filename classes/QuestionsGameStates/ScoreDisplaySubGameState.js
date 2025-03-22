export default class ScoreDisplaySubGameState {
  constructor(requestQuestionsGameState, configuration, state) {
    this.resultDisplayContainerElement = document.getElementById('result-display-container');
    this.resultTextElement = document.getElementById('result-text');
    this.resultScoreTextElement = document.getElementById('result-score-text');
    this.scoreElement = document.getElementById('score');
    
    this.configuration = configuration;
    this.state = state;
    this.requestQuestionsGameState = requestQuestionsGameState;
    
    this.resultDisplayContainerElement.style.display = 'none'
  }
  
  enter(from, data) {
    this.resultDisplayContainerElement.style.display = 'block'
    this.resultScoreTextElement.textContent = String(data.scoreGained)
    this.#setScore(this.state.score + data.scoreGained);
    
    switch (data.reason) {
      case 'correct':
        this.resultTextElement.textContent = "Parabéns"
        this.resultTextElement.style.color = 'green'
        break;
      case 'wrong':
        this.resultTextElement.textContent = "Você Errou!"
        this.resultTextElement.style.color = 'red'
        break;
      case 'time-out':
        this.resultTextElement.textContent = "O tempo acabou!"
        this.resultTextElement.style.color = 'red'
        break;
    }
    
    setTimeout(() => {
      if (this.configuration.numOfQuestions <= this.state.currentQuestion + 1) {
        this.requestQuestionsGameState('show-results');
      } else {
        this.requestQuestionsGameState('question');
      }
    }, this.configuration.timeOnResultsViewMs)
  }
  
  exit(to) {
    this.resultDisplayContainerElement.style.display = 'none'
  }
  
  #setScore(score) {
    this.state.score = score;
    this.scoreElement.textContent = score;
  }
}