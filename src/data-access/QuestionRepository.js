const Question = require("../models/Question.js");

class QuestionRepository {
    constructor(db) {
        this.db = db;
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM questions", (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => {
                    return new Question(
                        row.id,
                        row.text,
                        row.alternative1,
                        row.alternative2,
                        row.alternative3,
                        row.alternative4,
                        row.answer,
                    );
                }));
            });
        });
    }

    save(question) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO questions (text, alternative1, alternative2, alternative3, alternative4, answer) 
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            stmt.run(
                question.text,
                question.alternative1,
                question.alternative2,
                question.alternative3,
                question.alternative4,
                question.answer,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    update(question) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                UPDATE questions SET 
                    text = ? 
                    alternative1 = ? 
                    alternative2 = ? 
                    alternative3 = ? 
                    alternative4 = ? 
                    answer = ? 
                WHERE id = ?
            `);
            stmt.run(
                question.text,
                question.alternative1,
                question.alternative2,
                question.alternative3,
                question.alternative4,
                question.answer,
                question.id,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM questions WHERE id = ?`);
            stmt.run(id, err => err ? reject(err) : resolve(stmt));
            stmt.finalize();
        });
    }

    erase() {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM questions`);
            stmt.run(err => err ? reject(err) : resolve(stmt));
            stmt.finalize();
        });
    }

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY,
                text TEXT NOT NULL,
                alternative1 TEXT NOT NULL,
                alternative2 TEXT NOT NULL,
                alternative3 TEXT NOT NULL,
                alternative4 TEXT NOT NULL,
                answer TEXT NOT NULL
            );
        `;
        this.db.run(query);
    }

    seed() {
        const questions = [
            new Question(
                1,
                "Qual é o maior mamífero do mundo?",
                "Elefante Africano",
                "Baleia Azul",
                "Tubarão Branco",
                "Girafa",
                "Baleia Azul"
            ),
            new Question(
            2,
            "Qual animal é conhecido por ter uma memória excelente?",
            "Golfinho",
            "Elefante",
            "Corvo",
            "Chimpanzé",
            "Elefante"
            ),
            new Question(
            3,
            "Qual destes animais é um marsupial?",
            "Canguru",
            "Leão",
            "Tigre",
            "Urso",
            "Canguru"
            ),
            new Question(
            4,
            "Qual é o único mamífero capaz de voar?",
            "Morcego",
            "Águia",
            "Esquilo Voador",
            "Pinguim",
            "Morcego"
            ),
            new Question(
            5,
            "Qual animal é conhecido por dormir de cabeça para baixo?",
            "Preguiça",
            "Morcego",
            "Coruja",
            "Gato",
            "Morcego"
            ),
            new Question(
            6,
            "Qual destes animais é mais rápido em terra?",
            "Guepardo",
            "Leão",
            "Cavalo",
            "Cão",
            "Guepardo"
            ),
            new Question(
            7,
            "Qual animal é conhecido por mudar de cor para se camuflar?",
            "Camaleão",
            "Polvo",
            "Lagarto",
            "Sapo",
            "Camaleão"
            )
        ]

        questions.forEach(question => {
            this.save(question);
        })
    }
}
module.exports = QuestionRepository;