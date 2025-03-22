import QuestionDisplaySubGameState from "./QuestionsGameStates/QuestionDisplaySubGameState.js";
import ScoreDisplaySubGameState from "./QuestionsGameStates/ScoreDisplaySubGameState.js";
import CounterDisplaySubGameState from "./QuestionsGameStates/CountDownDisplaySubGameState.js";

export default class QuestionsGameState {
  constructor(requestGameState, configuration, state, questionsDb) {
    this.requestQuestionsGameState = this.requestQuestionsGameState.bind(this);
    
    this.questionAmountElement = document.getElementById('question-amount');
    
    this.configuration = configuration;
    this.questionAmountElement.textContent = String(this.configuration.numOfQuestions);
    this.state = state;
    
    this.states = {
      'question': new QuestionDisplaySubGameState(this.requestQuestionsGameState, configuration, state, questionsDb),
      'result': new ScoreDisplaySubGameState(this.requestQuestionsGameState, configuration, state),
      'countdown': new CounterDisplaySubGameState(this.requestQuestionsGameState, configuration),
      'show-results' : { enter(from) { requestGameState('show-results') } }
    }
  }
  
  enter(from) {
    this.currentState = 'countdown';
    this.states[this.currentState].enter(from);
  }
  
  exit(to) {}
  
  requestQuestionsGameState(gameState, data) {
    console.log('questions: ' + this.currentState + ' -> ' + gameState);
    
    this.states[this.currentState].exit(gameState);
    this.states[gameState].enter(this.currentState, data);
    this.currentState = gameState;
  }
}