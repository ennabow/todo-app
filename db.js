const sqlite3 = require('sqlite3').verbose()

const connect = function(err){
    if (err) {
        console.log(err.message);
    }
    console.log('table exists')
}

const db = new sqlite3.Database('./main.sqlite3', sqlite3.OPEN_READWRITE, connect)

const createTableQuery = 'CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL)';

db.run(createTableQuery, [], (err) => {
    if (err) {
        console.log(err.message)
        return;
    }
    console.log('db has been created')
})

module.exports = db;