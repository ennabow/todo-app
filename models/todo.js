const db = require("../db");

class Todo {
    static async connectDB(operation, query) {
        try {
            return new Promise((resolve, reject) => {
            let data;
            try {
                db[operation](query, [], (err, rows) => {

                if (err) {
                    console.log('select all is fail', err)
                }

                data = rows;
                resolve(rows)
            }) } catch (e) {
                reject(e)
                return e;
            }
            return data;
        })
        } catch(e) {
            console.error('Database connection error:', err);
            process.exit(1); // Завершаем процесс при ошибке подключения
        }
        
        
    }

    static async getAll() {
        return this.connectDB('all', 'SELECT * FROM todo');
    }

    static getById(id) {
        return this.connectDB(`SELECT * FROM todo WHERE id - ${id}`);
    }

    static async create(title, description) {
        return this.connectDB('run', `INSERT INTO todo (title, description) VALUES('${title}', '${description}')`)              
    }

    static async update(id, updates) {
        return this.connectDB(`UPDATE todo (title, description) SET title = '${updates.title}', description = '${updates.description}' WHERE id = ${id}`)
    }

    static async delete(id) {
        return this.connectDB(`DELETE FROM todo WHERE id = ${id}`)
    }
}

module.exports = Todo;