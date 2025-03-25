import {shuffle} from "@libs/ArrayUtilities.js";

export default class QuestionDisplaySubGameState {
  constructor(requestQuestionsGameState, configuration, state, questionsDb) {
    this.questionTextElement = document.getElementById('question-text');
    this.alternativesButtonsArr = document.getElementsByClassName('alternative-btn');
    this.currentQuestionElement = document.getElementById('current-question');
    this.timeBarElement = document.getElementById('time-bar');
    
    this.state = state;
    this.requestQuestionsGameState = requestQuestionsGameState;
    this.configuration = configuration;
    this.questionsDb = questionsDb;
    this.questions = [];
    
    this.timeOutRef = null;
    this.questionTextElement.style.display = 'none'
    
    this.#pauseTimer();
  }
  
  enter(from, data) {
    this.questionTextElement.style.display = 'block'
    this.#setAlternativesLocked(false);
    
    if (from === 'main-menu' || from === 'countdown') {
      this.currentQuestionElement.textContent = '1';
      
      this.#shuffleQuestions();
      
      this.state.currentQuestion = 0;
      this.#loadQuestion(this.questions[0]);
    } else if (from === 'result') {
      this.#nextQuestion()
    }
    
    this.#startTimer();
  }
  
  exit(to) {
    this.questionTextElement.style.display = 'none'
    this.#setAlternativesLocked(true);
    this.#pauseTimer();
  }
  
  #loadQuestion(question) {
    this.#loadAlternatives(question.alternatives);
    this.questionTextElement.textContent = question.title;
  }
  
  #loadAlternatives(alternatives) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      this.alternativesButtonsArr[i].textContent = alternatives[i];
      this.alternativesButtonsArr[i].onclick = () => {
        this.#choseAlternative(alternatives[i]);
      }
    }
  }
  
  #choseAlternative(alternative) {
    const isCorrect = this.questions[this.state.currentQuestion].answer === alternative
    
    if (isCorrect) {
      const scoreLostDueToTime = Date.now() - this.timeWhenStarted
      const scoreGained = (this.configuration.timePerQuestionMs - scoreLostDueToTime) * this.configuration.scoreMultiplier;
      
      this.requestQuestionsGameState('result', { reason: 'correct', scoreGained: scoreGained });
    } else {
      this.requestQuestionsGameState('result', { reason: 'wrong', scoreGained: 0 });
    }
  }
  
  #nextQuestion() {
    this.state.currentQuestion++;
    if (this.state.currentQuestion > this.questions.length - 1) {
      this.requestQuestionsGameState('result');
      return;
    }
    
    this.currentQuestionElement.textContent = String(this.state.currentQuestion + 1);
    this.#loadQuestion(this.questions[this.state.currentQuestion]);
  }
  
  #startTimer() {
    this.timeWhenStarted = Date.now();
    this.timeBarElement.classList.add('running');
    this.timeBarElement.classList.remove('returning');
    
    clearTimeout(this.timeOutRef)
    this.timeOutRef = setTimeout(() => {
      this.requestQuestionsGameState('result', { reason: 'time-out', scoreGained: 0 });
    }, this.configuration.timePerQuestionMs);
  }
  
  #pauseTimer() {
    clearTimeout(this.timeOutRef);
    this.timeBarElement.classList.remove('running');
    this.timeBarElement.classList.add('returning');
  }
  
  #setAlternativesLocked(isLocked) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      if (isLocked) {
        this.alternativesButtonsArr[i].classList.add('btn-locked');
        this.alternativesButtonsArr[i].onclick = undefined; // Remove event
      } else {
        this.alternativesButtonsArr[i].classList.remove('btn-locked');
      }
    }
  }
  
  #shuffleQuestions() {
    this.questions = shuffle(this.questionsDb);
    this.questions = this.questions.slice(0, this.configuration.numOfQuestions);
    this.questions.forEach(d => { d.alternatives = shuffle(d.alternatives) });
  }
}