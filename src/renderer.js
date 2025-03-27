import MainMenuGameState from '@classes/GameStates/MainMenuGameState.js';
import QuestionsGameState from '@classes/GameStates/QuestionsGameState.js';
import ShowResultsGameState from "@classes/GameStates/ShowResultsGameState.js";
import Keyboard from '@classes/Keyboard.js';
import 'simple-keyboard/build/css/index.css';
import FormGameState from "@classes/GameStates/FormGameState";

class PageContext {
  constructor(questions) {
    this.requestGameState = this.requestGameState.bind(this);
    
    this.configuration = {
      scoreMultiplier: 10,
      timePerQuestionMs: 5000,
      timeOnResultsViewMs: 1500,
      numOfQuestions: 5,
      countDownDurationSec: 3,
      goToMenuOnInactivityInResultScreenInSec: 15
    };
    this.state = {
      score: 0,
      currentQuestion: 0,
    };
    
    document.documentElement.style.setProperty(
        '--time-per-question-ms',
        `${this.configuration.timePerQuestionMs}ms`);
    document.documentElement.style.setProperty(
        '--time-on-results-view-ms',
        `${this.configuration.timeOnResultsViewMs}ms`);
    
    this.currentState = 'main-menu';
    this.states = {
      'main-menu': new MainMenuGameState(this.requestGameState, this.state),
      'questions': new QuestionsGameState(this.requestGameState, this.configuration, this.state, questions),
      'show-results': new ShowResultsGameState(this.requestGameState, this.configuration, this.state),
      'form': new FormGameState(this.requestGameState, this.configuration, this.state),
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

// Initialize page trigger
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.pageContent) {
    const questions = await window.bridge.getQuestions();
    window.pageContent = new PageContext(questions);
  }
});

if (!window.emailKeyboard) { // Global guard
  window.emailKeyboard = Keyboard.alphanumeric(
      'alphanumeric-keyboard',
      input => { document.getElementById('email-input').value = input });
}
if (!window.numericKeyboard) { // Global guard
  window.numericKeyboard = Keyboard.numeric(
      'numeric-keyboard',
      input => { document.getElementById('phone-input').value = input });
}
