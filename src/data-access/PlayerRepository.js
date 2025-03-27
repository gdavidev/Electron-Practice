class PlayerRepository {
    constructor(db) {
        this.db = db;
    }

    save(email, phone) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO players (email, phone) 
                VALUES (?, ?)
            `);
            stmt.run(email, phone, err => { err ? reject(err) : resolve(stmt) });
            stmt.finalize();
        });
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM players", (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL,
                phone TEXT NOT NULL
            );
        `;
        this.db.run(query);
    }
}
module.exports = PlayerRepository;