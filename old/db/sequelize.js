const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('mysql://bpkpenhzi0brtsrd:p64svbslxikvsnzm@jsftj8ez0cevjz8v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/lvz74x42v5w3aong', {
    logging: false
});

module.exports = { sequelize, Op }