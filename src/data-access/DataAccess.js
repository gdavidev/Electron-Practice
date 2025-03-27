const PlayerRepository = require("./PlayerRepository.js");
const QuestionRepository = require("./QuestionRepository.js");
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");

class DataAccess {
    constructor(userDataPath) {
        const dbPath = path.join(userDataPath, 'players.db');
        this.db = new sqlite3.Database(dbPath);

        this.playerRepository = new PlayerRepository(this.db);
        this.questionRepository = new QuestionRepository(this.db);
    }

    ensureCreated() {
        this.playerRepository.ensureCreated();
        this.questionRepository.ensureCreated();
    }
}
module.exports = DataAccess;