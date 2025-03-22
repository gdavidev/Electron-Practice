import MainMenuGameState from './classes/MainMenuGameState.js';
import QuestionsGameState from './classes/QuestionsGameState.js';
import ShowResultsGameState from "./classes/ShowResultsGameState.js";

class PageContext {
  constructor(data) {
    this.requestGameState = this.requestGameState.bind(this);
    
    this.configuration = {
      scoreMultiplier: 10,
      timePerQuestionMs: 5000,
      timeOnResultsViewMs: 1500,
      numOfQuestions: 2,
      countDownDurationSec: 3
    };
    this.state = {
      score: 0,
      currentQuestion: 0,
    };
    
    this.currentState = 'main-menu';
    this.states = {
      'main-menu': new MainMenuGameState(this.requestGameState, this.state),
      'questions': new QuestionsGameState(this.requestGameState, this.configuration, this.state, data),
      'show-results': new ShowResultsGameState(this.requestGameState, this.configuration, this.state),
    };
    this.states['main-menu'].enter('');
  }
  
  requestGameState(gameState) {
    console.log(this.currentState + ' -> ' + gameState);
    
    this.states[this.currentState].exit(gameState);
    this.states[gameState].enter(this.currentState);
    this.currentState = gameState;
  }
}
let pageContent;

// Initialize page trigger
window.bridge.onJsonData((event, data) => {
  pageContent = new PageContext(data);
});

