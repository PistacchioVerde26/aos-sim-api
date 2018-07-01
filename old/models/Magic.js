const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');

let Magic = sequelize.define('magic', {
    magic_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: Sequelize.STRING,
    desc: Sequelize.TEXT,
    fk_model: Sequelize.INTEGER,
    summon: Sequelize.TEXT
}, {
        timestamps: false,
        freezeTableName: true
    });

const updateMagic = async (magic, model_id) => {
    found = await Magic.findById(magic.magic_id);
    if(found){
        Magic.update(magic, {
            where: {
                magic_id: {[Op.eq]: magic.magic_id}
            }
        })
    }else{
        createMagic(magic, model_id);
    }
    return found;
}

const createMagic = async (magic, model_id) => {
    magic.fk_model = model_id;
    newMagic = await Magic.create(magic);
    return newMagic;
}

module.exports = { Magic, createMagic, updateMagic }