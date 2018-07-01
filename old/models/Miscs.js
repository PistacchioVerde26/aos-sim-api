const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');

let Miscs = sequelize.define('misc', {
    misc_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    type: Sequelize.STRING,
    name: Sequelize.STRING,
    desc: Sequelize.TEXT,
    fk_model: Sequelize.INTEGER
}, {
        timestamps: false,
        freezeTableName: true
    });


const updateMisc = async (misc, model_id) => {
    found = await Miscs.findById(misc.misc_id);
    if (found) {
        Miscs.update(misc, {
            where: {
                misc_id: { [Op.eq]: misc.misc_id }
            }
        })
    } else {
        createMisc(misc, model_id);
    }
    return found;
}

const createMisc = async (misc, model_id) => {
    misc.fk_model = model_id;
    newMisc = await Miscs.create(misc);
    return newMisc;
}

module.exports = { Miscs, createMisc, updateMisc }
