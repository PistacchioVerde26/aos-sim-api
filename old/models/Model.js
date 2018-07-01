const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');
const { Ability, createAbility, updateAbility } = require('./Ability');
const { Weapon, createWeapon, updateWeapon } = require('./Weapon');
const { Magic, createMagic, updateMagic } = require('./Magic');
const { Miscs, createMisc, updateMisc } = require('./Miscs');

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

const updateModel = async (model) => {

    found = await Model.findById(model.model_id);
    if (found) {

        Model.update(model, {
            where: {
                model_id: { [Op.eq]: model.model_id }
            }
        });

        if (model.abilities) {
            console.log('updating abilities');
            model.abilities.forEach(A => {
                updateAbility(A, model.model_id);
            })
        }

        if (model.magics) {
            console.log('updating magics');
            model.magics.forEach(M => {
                updateMagic(M, model.model_id);
            })
        }

        if (model.weapons) {
            console.log('updating weapons');
            model.weapons.forEach(W => {
                updateWeapon(W, model.model_id);
            })
        }

        if (model.miscs) {
            console.log('updating miscs');
            model.miscs.forEach(M => {
                updateMagic(M, model.model_id);
            })
        }

        if (model.move_table) {
            model.move_table.forEach(MT => {
                updateMoveTable(MT, model.model_id);
            })
        }

        return found;
    } else {
        return createModel(model);
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
    Model.create(model).then((newModel)=>{
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

const createMoveTable = async (moveTable, model_id) => {
    moveTable.fk_model = model_id;
    newMTable = await MoveTable.create(moveTable);
    return newMTable;
}

module.exports = { Model, MoveTable, createModel, updateModel }