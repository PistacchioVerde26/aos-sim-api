const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');
const { Ability, AbiTable, createAbility, updateAbility, checkAndDeleteAbility } = require('./Ability');
const { Weapon, DmgTable, createWeapon, updateWeapon, checkAndDeleteWeapons } = require('./Weapon');
const { Magic, createMagic, updateMagic, checkAndDeleteMagics } = require('./Magic');
const { Miscs, createMisc, updateMisc, checkAndDeleteMiscs } = require('./Miscs');

const Model = sequelize.define('model', {
    model_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: Sequelize.STRING,
    move: Sequelize.STRING,
    wounds: Sequelize.STRING,
    save_p: Sequelize.STRING,
    bravery: Sequelize.STRING,
    type: Sequelize.STRING,
    fk_army: Sequelize.INTEGER,
    fk_army2: Sequelize.INTEGER,
    keywords: Sequelize.TEXT,
    min_unit: Sequelize.INTEGER,
    max_unit: Sequelize.INTEGER,
    description: Sequelize.TEXT
}, {
        timestamps: false
    });

let MoveTable = sequelize.define('move_table', {
    move_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    range: Sequelize.STRING,
    value: Sequelize.STRING,
    fk_model: Sequelize.INTEGER
}, {
        timestamps: false,
        freezeTableName: true
    })

Model.hasMany(Ability, { foreignKey: 'fk_model', as: 'abilities' });
Model.hasMany(Weapon, { foreignKey: 'fk_model', as: 'weapons' });
Model.hasMany(Magic, { foreignKey: 'fk_model', as: 'magics' });
Model.hasMany(Miscs, { foreignKey: 'fk_model', as: 'miscs' });
Model.hasMany(MoveTable, { foreignKey: 'fk_model', as: 'move_table' });

const updateModel = async (updatedModel) => {
    found = await Model.findById(updatedModel.model_id, {
        include: [
            {
                model: Ability, as: 'abilities', include: [
                    { model: AbiTable, as: 'ability_table' }
                ]
            },
            { model: Magic, as: 'magics' },
            {
                model: Weapon, as: 'weapons', include: [
                    { model: DmgTable, as: 'damage_table' }
                ]
            },
            { model: Miscs, as: 'miscs' },
            { model: MoveTable, as: 'move_table' }
        ]
    });
    if (found) {
        
        Model.update(updatedModel, {
            where: {
                model_id: { [Op.eq]: updatedModel.model_id }
            }
        });

        if (updatedModel.abilities) {
            console.log('updating abilities');
            updatedModel.abilities.forEach(A => {
                updateAbility(A, updatedModel.model_id);
            })
            checkAndDeleteAbility(found.abilities, updatedModel.abilities);
        }

        if (updatedModel.magics) {
            console.log('updating magics');
            updatedModel.magics.forEach(M => {
                updateMagic(M, updatedModel.model_id);
            })
            checkAndDeleteMagics(found.magics, updatedModel.magics);
        }

        if (updatedModel.weapons) {
            console.log('updating weapons');
            updatedModel.weapons.forEach(W => {
                updateWeapon(W, updatedModel.model_id);
            })
            checkAndDeleteWeapons(found.weapons, updatedModel.weapons);
        }

        if (updatedModel.miscs) {
            console.log('updating miscs');
            updatedModel.miscs.forEach(M => {
                updateMisc(M, updatedModel.model_id);
            })
            checkAndDeleteMiscs(found.miscs, updatedModel.miscs);
        }

        if (updatedModel.move_table) {
            updatedModel.move_table.forEach(MT => {
                updateMoveTable(MT, updatedModel.model_id);
            })
            checkAndDeleteMoveTable(found.move_table, updatedModel.move_table);
        }

        return found;
    } else {
        return createModel(updatedModel);
    }

}

const updateMoveTable = async (movet, model_id) => {
    found = await MoveTable.findById(movet.move_id);
    if (found) {
        MoveTable.update(movet, {
            where: {
                move_id: { [Op.eq]: movet.move_id }
            }
        })
    } else {
        createMoveTable(movet, model_id);
    }
    return found;
}

const createModel = async (model) => {
    Model.create(model).then((newModel) => {
        if (model.abilities) {
            model.abilities.forEach(A => {
                createAbility(A, newModel.model_id)
            })
        }

        if (model.magics) {
            model.magics.forEach(M => {
                createMagic(M, newModel.model_id);
            })
        }

        if (model.weapons) {
            model.weapons.forEach(W => {
                createWeapon(W, newModel.model_id);
            })
        }

        if (model.miscs) {
            model.miscs.forEach(M => {
                createMisc(M, newModel.model_id);
            })
        }

        if (model.move_table) {
            model.move_table.forEach(MT => {
                createMoveTable(MT, newModel.model_id);
            })
        }
        return newModel;
    }).catch(e => e);

}

const checkAndDeleteMoveTable = async (oldMts, newMts) => {
    const moveTableToDelete = [];
    oldMts.forEach(oldMT => {
        if (newMts.find(newMT => newMT.move_id === oldMT.move_id) == null) {
            moveTableToDelete.push(oldMT);
        }
    })
    if (moveTableToDelete.length > 0) {
        moveTableToDelete.forEach(mt => {
            MoveTable.destroy({
                where: {
                    move_id: { [Op.eq]: mt.move_id }
                }
            })
        })

    }
}

const createMoveTable = async (moveTable, model_id) => {
    moveTable.fk_model = model_id;
    newMTable = await MoveTable.create(moveTable);
    return newMTable;
}

module.exports = { Model, MoveTable, createModel, updateModel }