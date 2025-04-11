const mysql = require('mysql2/promise');
require('dotenv').config();

async function query(sql, params) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            connectTimeout: process.env.MYSQL_TIMEOUT || 60000,
        });
        const [results, ] = await connection.execute(sql, params);
        await connection.destroy();

        return results;
    } catch(err) {
        err instanceof Error && console.log(err.message);
    }
}

module.exports = {
    query
}