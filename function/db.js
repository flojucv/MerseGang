const mysql = require('mysql2/promise');
const config = require('../bdd/config_bbd');

async function query(sql, params) {
    try {
        const connection = await mysql.createConnection(config.db);
        const [results, ] = await connection.execute(sql, params);
        console.log(results);
        await connection.destroy();

        return results;
    } catch(err) {
        err instanceof Error && console.log(err.message);
    }
}

module.exports = {
    query
}