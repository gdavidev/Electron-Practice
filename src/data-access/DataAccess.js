const PlayerRepository = require("./PlayerRepository.js");
const QuestionRepository = require("./QuestionRepository.js");
const ConfigurationRepository = require("./ConfigurationRepository.js");
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const fs = require('fs');

class DataAccess {
    constructor(userDataPath) {
        const dbPath = path.join(userDataPath, 'players.db');
        const firstDatabaseCreation = !fs.existsSync(dbPath);

        this.db = new sqlite3.Database(dbPath);

        this.playerRepository = new PlayerRepository(this.db);
        this.questionRepository = new QuestionRepository(this.db);
        this.configurationRepository = new ConfigurationRepository(this.db);

        if (firstDatabaseCreation) {
            this.db.serialize(() => {
                this.#ensureCreated();
                this.#seedDatabase();
            })
        }
    }

    #ensureCreated() {
        this.playerRepository.ensureCreated();
        this.questionRepository.ensureCreated();
        this.configurationRepository.ensureCreated();
    }

    #seedDatabase() {
        this.questionRepository.seed()
        this.configurationRepository.seed()
    }
}
module.exports = DataAccess;