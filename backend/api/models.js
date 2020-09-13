const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        uniqueKey: true,
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING,
    }

}, {
    tableName: 'Users',
    freezeTableName: true
});

const Product = sequelize.define('Products', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        uniqueKey: true,
    },
    description: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.INTEGER,
    },
    owner: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }

}, {
    tableName: 'Products',
    freezeTableName: true,
});

module.exports = { User, Product };

