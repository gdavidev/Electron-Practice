class Question {
    constructor(id, text, alternative1, alternative2, alternative3, alternative4, answer) {
        this.id = id;
        this.text = text
        this.alternative1 = alternative1
        this.alternative2 = alternative2
        this.alternative3 = alternative3
        this.alternative4 = alternative4
        this.answer = answer
    }
}
module.exports = Question;