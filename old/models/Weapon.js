const Sequelize = require('sequelize');

const { sequelize, Op } = require('./../db/sequelize');

let Weapon = sequelize.define('weapon', {
    wp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    type: Sequelize.INTEGER,
    name: Sequelize.STRING,
    range: Sequelize.STRING,
    attacks: Sequelize.STRING,
    to_hit: Sequelize.STRING,
    to_wound: Sequelize.STRING,
    rend: Sequelize.INTEGER,
    damage: Sequelize.STRING,
    fk_model: Sequelize.INTEGER
}, {
        timestamps: false
    });

let DmgTable = sequelize.define('dmg_table', {
    dmg_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    fk_weapon: Sequelize.INTEGER,
    range: Sequelize.STRING,
    value: Sequelize.STRING
}, {
        timestamps: false,
        freezeTableName: true
    })

Weapon.hasMany(DmgTable, { foreignKey: 'fk_weapon', as: 'damage_table' });

const updateWeapon = async (weapon, model_id) => {
    found = await Weapon.findById(weapon.wp_id);
    if (found) {
        Weapon.update(weapon, {
            where: {
                wp_id: { [Op.eq]: weapon.wp_id }
            }
        });
        if (weapon.damage_table) {
            weapon.damage_table.forEach(WT => {
                updateDmgTable(WT, weapon.wp_id);
            })
        }
    } else {
        createWeapon(weapon, model_id);
    }
    return found;
}

const updateDmgTable = async (dmgtable, wp_id) => {
    found = await DmgTable.findById(dmgtable.dmg_id);
    if (found) {
        DmgTable.update(dmgtable, {
            where: {
                dmg_id: { [Op.eq]: dmgtable.dmg_id }
            }
        });
    } else {
        createAbiTable(dmgtable, wp_id);
    }
    return found;
}

const checkAndDeleteWeapons = async (oldWps, newWps) => {
    const weaponsToDelete = [];
    oldWps.forEach(oldWP => {
        if (newWps.find(newWP => newWP.wp_id === oldWP.wp_id) == null) {
            weaponsToDelete.push(oldWP);
        }
    })
    if (weaponsToDelete.length > 0) {
        weaponsToDelete.forEach(wp => {
            Weapon.destroy({
                where: {
                    wp_id: { [Op.eq]: wp.wp_id }
                }
            })
        })
    }
}

const createWeapon = async (weapon, model_id) => {
    weapon.fk_model = model_id;
    newWeapon = await Weapon.create(weapon);
    if (weapon.damage_table) {
        weapon.damage_table.forEach(DT => {
            createDmgTable(DT, newWeapon.wp_id);
        })
    }
}

const createDmgTable = async (dmgtable, wp_id) => {
    dmgtable.fk_weapon = wp_id;
    newDmgTable = await DmgTable.create(dmgtable);
    return newDmgTable;
}

module.exports = { Weapon, DmgTable, createWeapon, updateWeapon, checkAndDeleteWeapons }