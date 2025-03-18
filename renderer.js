window.bridge.onJsonData((event, data) => {
  initializePage(data);
});

function initializePage(questionsData) {
  const shuffledQuestions = shuffle(questionsData);
  
  let currentQuestion = 0
  const nextQuestion = () => {
    currentQuestion++;
    console.log(currentQuestion);
    loadQuestion(shuffledQuestions[currentQuestion], nextQuestion)
  }
  // Load First
  loadQuestion(shuffledQuestions[0], nextQuestion);
}

function loadQuestion(question, nextQuestionCallbackFn) {
  const buttonsContainer = document.getElementById('alternatives-container');
  const buttons = question.alternatives.map(a => createAlternativeButton(a, a === question.answer));
  
  const questionTextElement = document.getElementById('question');
  questionTextElement.textContent = question.question;
  
  const nextButton = document.getElementById('next-button');
  nextButton.onclick = nextQuestionCallbackFn;
  
  hideDialog();
  
  clearButtonsContainer(buttonsContainer);
  for (let i = 0; i < buttons.length; i++) {
    buttonsContainer.appendChild(buttons[i]);
  }
}

function createAlternativeButton(text, isCorrect) {
  const button = document.createElement('button');
  button.onclick =  () => showDialog(isCorrect);
  button.classList.add('alternative-btn');
  button.textContent = text;
  
  return button;
}

function showDialog(isCorrect) {
  const dialog = document.getElementById('dialog-result');
  const dialogMessage = document.getElementById('result-message');
  dialogMessage.textContent = isCorrect ? 'You did it' : 'You\'re dumb';
  dialog.style.display = 'block';
}

function hideDialog() {
  const dialog = document.getElementById('dialog-result');
  dialog.style.display = 'none';
}

function clearButtonsContainer(container) {
  while (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
  }
}

function shuffle(array) {
  let subjectArray = array.slice();
  let currentIndex = array.length;
  
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [subjectArray[currentIndex], subjectArray[randomIndex]] = [subjectArray[randomIndex], subjectArray[currentIndex]];
  }
  
  return subjectArray;
}