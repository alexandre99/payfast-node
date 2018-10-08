const { Client } = require('pg');
function createDBConnection() {
    return new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'payfast',
        password: 'regina12',
        port: 5432
    });
};

module.exports = function () {
    return createDBConnection;
}