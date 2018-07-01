const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('lvz74x42v5w3aong', 'bpkpenhzi0brtsrd', 'p64svbslxikvsnzm', {
    host: '	jsftj8ez0cevjz8v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: true
});

module.exports = { sequelize, Op }