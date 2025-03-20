import { shuffle } from './libs/ArrayUtilities.js'
import { replaceChildren } from './libs/HtmlElementsUtilities.js'

class PageContent {
  questionTextElement = document.getElementById('question');
  dialogMessageElement = document.getElementById('result-message');
  dialog = document.getElementById('dialog-result');
  nextQuestionButton = document.getElementById('next-button');
  alternativesButtonsArr = document.getElementsByClassName('alternative-btn');
  scoreElement = document.getElementById('score');
  maxScoreElement = document.getElementById('max-score');
  
  score = 0;
  maxScore = 0;
  
  loadAlternatives(alternatives, answer) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      const isCorrect = alternatives[i] === answer

      this.alternativesButtonsArr[i].textContent = alternatives[i];
      this.alternativesButtonsArr[i].onclick = () => this.showDialogResult(isCorrect);
    }
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
  
  showDialogResult(isCorrect) {
    if (isCorrect) {
      this.setDialogText("Você acertou!");
      this.setScore(this.score + 1);
    } else {
      this.setDialogText("Você errou!");
    }
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
  
  const shuffledQuestions = shuffleQuestions(data);
  const chosenQuestions = shuffledQuestions.slice(0, 5);
  initializePage(chosenQuestions);
});

function shuffleQuestions(data) {
  data.forEach(d => { d.alternatives = shuffle(d.alternatives) });
  return shuffle(data);
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