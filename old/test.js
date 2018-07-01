const util = require('util');
const bodyParser = require('body-parser');

const { Op } = require('./db/sequelize');
const { Model, MoveTable } = require('./models/Model');
const { Ability, AbiTable } = require('./models/Ability');
const { Weapon, DmgTable } = require('./models/Weapon');
const { Magic } = require('./models/Magic');
const { Miscs } = require('./models/Miscs');

Model.findOne({
    where: {
        model_id: { [Op.eq]: 346 },
    },
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
}).then(model => {
    console.log(model);
}).catch(e => {
    console.log(e);
});