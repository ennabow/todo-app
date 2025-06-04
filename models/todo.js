class Todo {
    static async connectDB(query) {
        const mysql = require('mysql2/promise');

        async function connect() {
            const conn = await mysql.createConnection({
                host: 'localhost',
                user: 'admin',
                password: 'Smorodina14*50',
                database: 'todoDB'
            });
            const [rows] = await conn.query(query);
            await conn.end();
            return rows;
        }

        return await connect();
    }

    static async getAll() {
        return this.connectDB('SELECT * FROM todo');
    }

    static getById(id) {
        return this.connectDB(`SELECT * FROM todo WHERE id - ${id}`);
    }

    static async create(title, description = '') {
        return this.connectDB(`INSERT INTO todo (title, description) VALUES('${title}', '${description}')`)              
    }

    static async update(id, updates) {
        return this.connectDB(`UPDATE todo (title, description) SET title = '${updates.title}', description = '${updates.description}' WHERE id = ${id}`)
    }

    static async delete(id) {
        return this.connectDB(`DELETE FROM todo WHERE id = ${id}`)
    }
}

module.exports = Todo;