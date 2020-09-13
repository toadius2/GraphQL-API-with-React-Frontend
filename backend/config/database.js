const Sequelize = require('sequelize');

const database = new Sequelize({
    database: 'graphql',
    username: 'root',
    password: 'AKKUaaina@123',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});

module.exports = database;