const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('aos_db_testing', 'root', '', {
    dialect: 'mysql',
    logging: true
});

module.exports = { sequelize, Op }