import MainMenuGameState from '@classes/GameStates/MainMenuGameState.js';
import QuestionsGameState from '@classes/GameStates/QuestionsGameState.js';
import ShowResultsGameState from "@classes/GameStates/ShowResultsGameState.js";
import Keyboard from '@classes/Keyboard.js';
import 'simple-keyboard/build/css/index.css';
import FormGameState from "@classes/GameStates/FormGameState";
import AdminMenuGameState from "@classes/GameStates/AdminMenuGameState";

let questions = []
let configuration = new Map()

class PageContext {
  constructor() {
    this.requestGameState = this.requestGameState.bind(this);
    this.updateQuestions = this.updateQuestions.bind(this);
    this.updateConfiguration = this.updateConfiguration.bind(this);
    
    this.state = {
      score: 0,
      currentQuestion: 0,
    };
    
    Promise.all([
      this.updateQuestions(),
      this.updateConfiguration(),
    ]).then(() => {
      this.#initializeStates()
      this.currentState = 'main-menu';
      this.states['main-menu'].enter('');
    });
  }

  #initializeStates() {
    this.states = {
      'main-menu': new MainMenuGameState(this.requestGameState, this.state),
      'questions': new QuestionsGameState(this.requestGameState, configuration, this.state, questions),
      'show-results': new ShowResultsGameState(this.requestGameState, configuration, this.state),
      'form': new FormGameState(this.requestGameState, configuration, this.state),
      'admin': new AdminMenuGameState(this.requestGameState, async () => {
        Promise.all([
          this.updateQuestions(),
          this.updateConfiguration(),
        ]).then(() => {
          this.#initializeStates()
        })
      }),
    };
  }
  
  requestGameState(gameState) {
    console.log(this.currentState + ' -> ' + gameState);
    
    this.states[this.currentState].exit(gameState);
    this.states[gameState].enter(this.currentState);
    this.currentState = gameState;
  }

  async updateQuestions() {
    questions = await window.bridge.questions.get();
  }

  async updateConfiguration() {
    const rawConfigs = await window.bridge.configuration.get()
    rawConfigs.forEach((config) => {
      configuration.set(
          config.propertyName,
          !isNaN(parseFloat(config.value)) ? Number(config.value) : config.value);
    })

    configuration.set("numOfQuestions",
        configuration.get("numOfQuestions") > questions.length ?
            questions.length :
            configuration.get("numOfQuestions")
    )

    document.documentElement.style.setProperty(
        '--time-per-question-ms',
        `${configuration.get('timePerQuestionMs')}ms`);
    document.documentElement.style.setProperty(
        '--time-on-results-view-ms',
        `${configuration.get('timeOnResultsViewMs')}ms`);
  }
}

// Initialize page trigger
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.pageContent) {
    window.pageContent = new PageContext();
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
