import { shuffle } from './libs/ArrayUtilities.js';

class PageContent {
  // Elements
  questionTextElement = document.getElementById('question-text');
  alternativesButtonsArr = document.getElementsByClassName('alternative-btn');
  scoreElement = document.getElementById('score');
  timeBarElement = document.getElementById('time-bar');
  resultTextElement = document.getElementById('result-text');
  resultDisplayContainerElement = document.getElementById('result-display-container');
  resultScoreTextElement = document.getElementById('result-score-text');
  currentQuestionElement = document.getElementById('progress');
  questionAmountElement = document.getElementById('max-progress');
  
  // Data
  questions = [];
  
  // Configuration
  scoreMultiplier = 10;
  timePerQuestionMs = 5000;
  timeOnResultsViewMs = 1500;
  numOfQuestions = 5;
  
  // State
  score = 0;
  currentQuestion = 0;
  timeWhenStarted = 0;
  timeBarAnimation = null;
  timeOutRef = null;
  
  loadPage(data) {
    const shuffledQuestions = shuffleQuestions(data);
    this.questions = shuffledQuestions.slice(0, this.numOfQuestions);
    this.questionAmountElement.textContent = String(this.questions.length);
    this.currentQuestionElement.textContent = '1';
    this.timeBarAnimation = this.createTimeBarAnimation()
    this.setScore(0);
    
    this.switchToQuestionView();
    
    this.loadQuestion(this.questions[0]);
  }
  
  nextQuestion() {
    this.currentQuestion++;
    this.currentQuestionElement.textContent = String(this.currentQuestion + 1);
    this.loadQuestion(this.questions[this.currentQuestion]);
  }
  
  loadQuestion(question) {
    this.loadAlternatives(question.alternatives);
    this.setQuestionText(question.title);
  }
  
  loadAlternatives(alternatives) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      this.alternativesButtonsArr[i].textContent = alternatives[i];
      this.alternativesButtonsArr[i].onclick = () => {
        this.choseAlternative(alternatives[i]);
      }
    }
  }
  
  choseAlternative(alternative) {
    const isCorrect = this.questions[this.currentQuestion].answer === alternative
    
    if (isCorrect) {
      const scoreGained = (Date.now() - this.timeWhenStarted) * this.scoreMultiplier;
      
      this.setScore(this.score + scoreGained);
      this.switchToResultView('correct', scoreGained)
    } else {
      this.switchToResultView('wrong', 0)
    }
  }
  
  switchToResultView(reason, scoreGained) {
    this.setAlternativesLocked(true);
    this.pauseTimer();
    
    this.resultDisplayContainerElement.style.display = 'block'
    this.questionTextElement.style.display = 'none';
    this.resultScoreTextElement.textContent = String(scoreGained)
    
    switch (reason) {
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
      this.switchToQuestionView();
      this.nextQuestion();
    }, this.timeOnResultsViewMs)
  }
  
  switchToQuestionView() {
    this.setAlternativesLocked(false);
    this.timeBarElement.style.animationPlayState = 'running'
    
    this.resultDisplayContainerElement.style.display = 'none';
    this.questionTextElement.style.display = 'block';
    
    this.startTimer()
  }
  
  startTimer() {
    this.timeWhenStarted = Date.now();
    this.timeBarAnimation.finish()
    this.timeBarAnimation.play()
    
    clearTimeout(this.timeOutRef)
    this.timeOutRef = setTimeout(() => {
      this.switchToResultView('time-out', 0)
    }, this.timePerQuestionMs);
  }
  
  pauseTimer() {
    clearTimeout(this.timeOutRef);
    this.timeBarAnimation.pause();
  }
  
  createTimeBarAnimation() {
    return this.timeBarElement.animate([
      { 'background': 'green', 'width': '100%', },
      { 'background': 'red', 'width': '0%', }
    ], {
      duration: this.timePerQuestionMs,
    })
  }
  
  setAlternativesLocked(isLocked) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      if (isLocked) {
        this.alternativesButtonsArr[i].classList.add('btn-locked');
        this.alternativesButtonsArr[i].onclick = undefined; // Remove event
      } else {
        this.alternativesButtonsArr[i].classList.remove('btn-locked');
      }
    }
  }
  
  setScore(score) {
    this.score = score;
    this.scoreElement.textContent = score;
  }
  
  setQuestionText(text) {
    this.questionTextElement.textContent = text;
  }
}
let pageContent;
let questionsDatabase;

// Initialize page trigger
window.bridge.onJsonData((event, data) => {
  questionsDatabase = data;
  
  pageContent = new PageContent();
  pageContent.loadPage(data);
});

function shuffleQuestions(data) {
  data.forEach(d => { d.alternatives = shuffle(d.alternatives) });
  return shuffle(data);
}