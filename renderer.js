import { shuffle } from './libs/ArrayUtilities.js'
import { replaceChildren } from './libs/HtmlElementsUtilities.js'

class PageContent {
  questionTextElement = document.getElementById('question');
  dialogMessageElement = document.getElementById('result-message');
  dialog = document.getElementById('dialog-result');
  nextQuestionButton = document.getElementById('next-button');
  alternativesContainer = document.getElementById('alternatives-container');
  scoreElement = document.getElementById('score');
  maxScoreElement = document.getElementById('max-score');
  
  score = 0;
  maxScore = 0;
  
  loadAlternatives(alternatives, answer) {
    const buttons = alternatives.map(a => createAlternativeButton(a, a === answer))
    replaceChildren(this.alternativesContainer, buttons);
  }
  
  setScore(score) {
    this.score = score;
    this.scoreElement.textContent = score;
  }
  
  setMaxScore(maxScore) {
    this.maxScore = maxScore;
    this.maxScoreElement.textContent = maxScore;
  }
  
  setQuestionText(text) {
    this.questionTextElement.textContent = text;
  }
  
  setDialogText(text) {
    this.dialogMessageElement.textContent = text;
  }
  
  showDialog() {
    this.dialog.style.display = 'block';
  }
  
  hideDialog() {
    this.dialog.style.display = 'none';
  }
  
  setOnNextButtonClick(callback) {
    this.nextQuestionButton.onclick = callback;
  }
}
let pageContent;

window.bridge.onJsonData((event, data) => {
  pageContent = new PageContent();
  
  const shuffledQuestions = shuffleQuestions(data)
  initializePage(shuffledQuestions);
});

function shuffleQuestions(data) {
  data.forEach(d => { d.alternatives = shuffle(d.alternatives) });
  return shuffle(data)
}

function initializePage(questionsData) {
  pageContent.setMaxScore(questionsData.length);
  pageContent.setScore(0);
  
  const nextQuestion = (questionIndex) => {
    loadQuestion(
        questionsData[questionIndex],
        () => nextQuestion(questionIndex + 1)
    );
  }
  nextQuestion(0);
}

function loadQuestion(question, nextQuestionCallbackFn) {
  pageContent.setOnNextButtonClick(nextQuestionCallbackFn);
  pageContent.loadAlternatives(question.alternatives, question.answer);
  pageContent.setQuestionText(question.title);
  pageContent.hideDialog();
}

function createAlternativeButton(text, isCorrect) {
  const button = document.createElement('button');
  button.onclick =  () => {
    if (isCorrect) {
      pageContent.setDialogText("Você acertou!");
      pageContent.setScore(pageContent.score + 1);
    } else {
      pageContent.setDialogText("Você errou!");
    }
    pageContent.showDialog();
  }
  button.classList.add('alternative-btn');
  button.textContent = text;
  
  return button;
}