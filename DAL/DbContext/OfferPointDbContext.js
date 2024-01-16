const mysql = require('mysql');
const config = require('../../Config');

class OfferPointDbContext{
    constructor(){
        const connection = mysql.createConnection(config.databaseConfig);
        connection.connect();
        this.context = connection;
    }
    getContext(){
        return this.context;
    }
}

module.exports = OfferPointDbContext