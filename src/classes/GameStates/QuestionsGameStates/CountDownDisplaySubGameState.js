export default class CounterDisplaySubGameState {
  constructor(requestQuestionsGameState, configuration) {
    this.countDownTextElement = document.getElementById('countdown-text');
    
    this.requestQuestionsGameState = requestQuestionsGameState;
    this.configuration = configuration;
    
    this.countDownTextElement.style.display = 'none';
  }
  
  enter(from) {
    this.countDownTextElement.style.display = 'block';
    this.#startCountDown();
  }
  
  exit(to) {
    this.countDownTextElement.style.display = 'none';
  }
  
  #startCountDown() {
    let count = this.configuration.get('countDownDurationSec');

    this.countDownTextElement.textContent = String(count);
    const intervalRef = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(intervalRef);
        this.requestQuestionsGameState('question')
      }
      
      this.countDownTextElement.textContent = String(count);
    }, 1000)
  }
}