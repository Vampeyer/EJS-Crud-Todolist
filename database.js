const sqlite3 = require('sqlite3').verbose();

// Open a database handle
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );
    `);
});

function createItem(name, description, callback) {
    db.run(`INSERT INTO items (name, description) VALUES (?, ?)`, [name, description], function(err) {
        callback(err, this.lastID);
    });
}

function readItems(callback) {
    db.all(`SELECT * FROM items`, [], (err, rows) => {
        callback(err, rows);
    });
}

function updateItem(id, name, description, callback) {
    db.run(`UPDATE items SET name = ?, description = ? WHERE id = ?`, [name, description, id], function(err) {
        callback(err);
    });
}

function deleteItem(id, callback) {
    db.run(`DELETE FROM items WHERE id = ?`, id, function(err) {
        callback(err);
    });
}

module.exports = { createItem, readItems, updateItem, deleteItem };

// Close the database connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closing the database connection.');
        process.exit(0);
    });
});