const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');

let Ability = sequelize.define('ability', {
    ability_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    command: Sequelize.INTEGER,
    fk_model: Sequelize.INTEGER
}, {
        timestamps: false
    });

let AbiTable = sequelize.define('abi_table', {
    _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    fk_abi: Sequelize.INTEGER,
    range: Sequelize.STRING,
    value: Sequelize.STRING,
    desc: Sequelize.TEXT
}, {
        timestamps: false,
        freezeTableName: true
    })

Ability.hasMany(AbiTable, { foreignKey: 'fk_abi', as: 'ability_table' });

const updateAbility = async (ability, model_id) => {
    try {
        found = await Ability.findById(ability.ability_id);
        if (found) {
            Ability.update(ability, {
                where: {
                    ability_id: { [Op.eq]: ability.ability_id }
                }
            }).catch(e => console.log(e));
            if (ability.ability_table) {
                ability.ability_table.forEach(AT => {
                    updateAbiTable(AT, ability.ability_id);
                })
            }
        } else {
            createAbility(ability, model_id);
        }
        return found;
    } catch (error) {
        console.log(error)
    }

}

const checkAndDeleteAbility = async (oldAbis, newAbis) => {
    const abilitiesToDelete = [];
    oldAbis.forEach(oldAbi => {
        if (newAbis.find(newAbi => newAbi.ability_id === oldAbi.ability_id) == null) {
            abilitiesToDelete.push(oldAbi);
        }
    })
    if (abilitiesToDelete.length > 0) {
        abilitiesToDelete.forEach(abi => {
            Ability.destroy({
                where: {
                    ability_id: { [Op.eq]: abi.ability_id }
                }
            })
        })
    }
}

const updateAbiTable = async (abitable, abi_id) => {
    found = await AbiTable.findById(abitable._id);
    if (found) {
        AbiTable.update(abitable, {
            where: {
                _id: { [Op.eq]: abitable._id }
            }
        });
    } else {
        createAbiTable(abitable, abi_id);
    }
    return found;
}

const createAbility = async (ability, model_id) => {
    ability.fk_model = model_id;
    newAbi = await Ability.create(ability);
    if (ability.ability_table) {
        ability.ability_table.forEach(AT => {
            createAbiTable(AT, newAbi.ability_id);
        })
    }
}

const createAbiTable = async (abitable, abi_id) => {
    abitable.fk_abi = abi_id;
    newAbi = await AbiTable.create(abitable);
    return newAbi;
}

module.exports = { Ability, AbiTable, createAbility, updateAbility, checkAndDeleteAbility }