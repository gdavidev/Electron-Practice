const ConfigurationItem = require("../models/ConfigurationItem");

class ConfigurationRepository {
    constructor(db) {
        this.db = db;
    }

    save(configurationItem) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO configuration (name, propertyName, value) 
                VALUES (?, ?, ?)
            `);
            stmt.run(
                configurationItem.name,
                configurationItem.propertyName,
                configurationItem.value,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    update(configurationItem) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                UPDATE configuration SET 
                    value = ?
                WHERE propertyName = ?
            `);
            stmt.run(
                configurationItem.value,
                configurationItem.propertyName,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM configuration", (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => new ConfigurationItem(
                    row.name,
                    row.propertyName,
                    row.value,
                )));
            });
        });
    }

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS configuration (
                name TEXT NOT NULL,
                propertyName TEXT NOT NULL,
                value TEXT NOT NULL
            );
        `;
        this.db.run(query);
    }

    seed() {
        const configurationItems = [
            new ConfigurationItem(
                'Multiplicador de pontuação',
                'scoreMultiplier',
                10),
            new ConfigurationItem(
                'Tempo por questão (Milissegundos)',
                'timePerQuestionMs',
                5000),
            new ConfigurationItem(
                'Tempo na tela de resultados da questão (Milissegundos)',
                'timeOnResultsViewMs',
                1500),
            new ConfigurationItem(
                'Quantidade de questões por round',
                'numOfQuestions',
                5),
            new ConfigurationItem(
                'Tempo do cronômetro inicial',
                'countDownDurationSec',
                3),
            new ConfigurationItem(
                'Tempo para sair do resultado final por inatividade (Segundos)',
                'goToMenuOnInactivityInResultScreenInSec',
                15),
        ];
        configurationItems.forEach(configurationItem => {
            this.save(configurationItem);
        })
    }
}
module.exports = ConfigurationRepository;