import Question from "../../../models/Question";
import FormBuilder from "@classes/FormBuilder";

export default class QuestionDisplaySubGameState {
    constructor() {
        this.adminQuestionsContainer = document.getElementById('admin-questions-container');
        this.adminQuestionsInputContainer = document.getElementById('admin-questions-input-container');
        this.adminAddQuestionBtn = document.getElementById('admin-add-question-btn');
        this.adminSaveQuestionsBtn = document.getElementById('admin-save-questions-btn');

        this.adminAddQuestionBtn.style.display = 'none';
        this.adminSaveQuestionsBtn.style.display = 'none';
        this.adminAddQuestionBtn.onclick = () => this.#addNewQuestion();
        this.adminSaveQuestionsBtn.onclick = () => this.#saveQuestions();
    }

    enter(from, data) {
        this.adminQuestionsContainer.style.display = 'block';
        this.adminAddQuestionBtn.style.display = 'block';
        this.adminSaveQuestionsBtn.style.display = 'block';
        this.#loadQuestions();
    }

    exit(to) {
        this.adminQuestionsContainer.style.display = 'none';
        this.adminAddQuestionBtn.style.display = 'none';
        this.adminSaveQuestionsBtn.style.display = 'none';
    }

    #loadQuestions() {
        this.#clearQuestions();

        window.bridge.questions.get()
            .then((res) => {
                res.forEach(question => {
                    this.adminQuestionsInputContainer.appendChild(this.#createQuestionFormNugget(question));
                })
            })
    }

    #addNewQuestion() {
        this.adminQuestionsInputContainer.appendChild(this.#createQuestionFormNugget());
    }

    #saveQuestions() {
        const questions = this.#retrieveAllQuestions();

        window.bridge.questions.erase()
            .then(() => {
                questions.forEach(question => {
                    window.bridge.questions.save(question)
                })
            });
    }

    #clearQuestions() {
        while (this.adminQuestionsInputContainer.firstChild) {
            this.adminQuestionsInputContainer.removeChild(this.adminQuestionsInputContainer.firstChild)
        }
    }

    #retrieveAllQuestions() {
        const formNuggets =
            this.adminQuestionsContainer.getElementsByClassName('form-nugget');
        const questions = [];

        Array.from(formNuggets).forEach((nugget) => {
            questions[questions.length] = new Question(
                0,
                nugget.querySelector('[name=Texto]').value,
                nugget.querySelector('[name=Alternativa-1]').value,
                nugget.querySelector('[name=Alternativa-2]').value,
                nugget.querySelector('[name=Alternativa-3]').value,
                nugget.querySelector('[name=Alternativa-4]').value,
                nugget.querySelector('[name=Resposta]').value
            );
        });

        return questions;
    }

    #createQuestionFormNugget(question) {
        const container = FormBuilder.div(
            'form-nugget', [
                FormBuilder.formItem('Texto', question ? question.text : ''),
                FormBuilder.div(
                    'form-row', [
                        FormBuilder.formItem('Alternativa 1', question ? question.alternative1 : ''),
                        FormBuilder.formItem('Alternativa 2', question ? question.alternative2 : ''),
                    ]),
                FormBuilder.div(
                    'form-row', [
                        FormBuilder.formItem('Alternativa 3', question ? question.alternative3 : ''),
                        FormBuilder.formItem('Alternativa 4', question ? question.alternative4 : ''),
                    ]),
                FormBuilder.formItem('Resposta', question ? question.answer : '')
            ]);

        const eraseButton = document.createElement('button');
        eraseButton.className = 'btn btn-md btn-red';
        eraseButton.textContent = 'Apagar'
        eraseButton.onclick = () => this.adminQuestionsInputContainer.removeChild(container);

        container.appendChild(eraseButton);

        return container;
    }


}