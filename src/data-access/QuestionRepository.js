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
                        row.title,
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
                INSERT INTO questions (title, text, alternative1, alternative2, alternative3, alternative4, answer) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(
                question.title,
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

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
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
}
module.exports = QuestionRepository;