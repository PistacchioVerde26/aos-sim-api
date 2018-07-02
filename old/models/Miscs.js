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

const checkAndDeleteMiscs = async (oldMiscs, newMiscs) => {
    const miscsToDelete = [];
    oldMiscs.forEach(oldM => {
        if (newMiscs.find(newM => newM.misc_id === oldM.misc_id) == null) {
            miscsToDelete.push(oldM);
        }
    })
    if (miscsToDelete.length > 0) {
        miscsToDelete.forEach(m => {
            Miscs.destroy({
                where: {
                    misc_id: { [Op.eq]: m.misc_id }
                }
            })
        })

    }
}

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

module.exports = { Miscs, createMisc, updateMisc, checkAndDeleteMiscs }
