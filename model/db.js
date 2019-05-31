const pg = require('pg');

var config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.query('SELECT * FROM users', (err, res) => {
    console.log(err, res)
    pool.end()
})


module.exports = pool;