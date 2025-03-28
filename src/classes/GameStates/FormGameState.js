export default class FormGameState {
  constructor(requestGameState, configuration, state) {
    this.formContainer = document.getElementById('form-container');
    this.alphanumericKeyboard = document.getElementsByClassName('alphanumeric-keyboard')[0];
    this.numericKeyboard = document.getElementsByClassName('numeric-keyboard')[0];
    this.emailInput = document.getElementById('email-input');
    this.phoneInput = document.getElementById('phone-input');
    this.submitButton = document.getElementById('submit-btn');
    this.cancelButton = document.getElementById('cancel-btn');
    
    this.#showForm();
    this.emailInput.onfocus = () => this.#showAlphanumericKeyboard()
    this.phoneInput.onfocus = () => this.#showNumericKeyboard()

    const emailKeyboardEnterBtn = window.emailKeyboard.getButtonElement('{enter}')
    emailKeyboardEnterBtn.onclick = () => this.#showNumericKeyboard();
    
    this.cancelButton.onclick = () => requestGameState('main-menu');
    this.submitButton.onclick = () => {
      this.#savePlayerInfo();
      requestGameState('questions');
    }
  }
  
  enter(from) {
    this.#clearForm()
    this.#showAlphanumericKeyboard();
    this.#showForm();
  }
  
  exit(to) {
    if (to !== 'main-menu') {
      this.#hideForm();
    }
  }
  
  #hideForm() {
    this.formContainer.classList.add('hidden')
    this.formContainer.classList.remove('returning')
  }
  
  #showForm() {
    this.formContainer.classList.remove('hidden')
    this.formContainer.classList.add('returning')
  }

  #savePlayerInfo() {
    const email = String(this.emailInput.value);
    const phone = String(this.phoneInput.value);

    window.bridge.players.save(email, phone);
  }

  #clearForm() {
    this.emailInput.value = ''
    this.phoneInput.value = ''
  }
  
  #showNumericKeyboard() {
    this.phoneInput.focus();
    this.alphanumericKeyboard.style.display = 'none'
    this.numericKeyboard.style.display = 'block'
  }
  
  #showAlphanumericKeyboard() {
    this.emailInput.focus();
    this.alphanumericKeyboard.style.display = 'block'
    this.numericKeyboard.style.display = 'none'
  }
}