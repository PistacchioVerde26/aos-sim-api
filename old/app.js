const express = require('express');
const bodyParser = require('body-parser');
// const util = require('util');
var cors = require('cors');

const { Op } = require('./db/sequelize');
const { Model, MoveTable, createModel, updateModel } = require('./models/Model');
const { Ability, AbiTable } = require('./models/Ability');
const { Weapon, DmgTable } = require('./models/Weapon');
const { Magic } = require('./models/Magic');
const { Miscs } = require('./models/Miscs');

var app = express();

const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json());

app.options('*', cors()) // da includere prima delle altre routes

app.get('/isalive', (req, res) => {
    res.send({ message: 'Server is alive' });
});

// /MODEL
app.get('/aos/old/model/:id', (req, res) => {
    let id = req.params.id;
    Model.findOne({
        where: {
            model_id: { [Op.eq]: id },
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
        res.send(model);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.post('/aos/old/model/new', (req, res) => {
    const reqModel = req.body;
    createModel(reqModel).then(result => {
        res.send(result);
    }).catch(e => res.status(500).send(e));
});

app.post('/aos/old/model/update', (req, res) => {
    const reqModel = req.body;
    updateModel(reqModel).then(result => {
        res.send(result);
    }).catch(e => res.status(400).send(e));
})

//MODELS

app.get('/aos/old/models', (req, res) => {
    Model.findAll({
        order: [
            ['name', 'ASC']
        ]
    }).then(models => {
        res.send(models);
    }).catch(e => {
        res.status(400).send(e);
    });
})

app.listen(port, () => {
    console.log('Server is up on port', port);
});

    // Model.findOne({
    //     where: {
    //         model_id: { [Op.eq]: 1 }
    //     }
    // }).then(model => {
    //     model.getAbilities().then((res) => {
    //         doc = res;
    //     })
    // });

// Model.findOne({
//     where: {
//         model_id: { [Op.eq]: 1},
//     },
//     include: [
//         { model: Ability, as: 'Abilities'}
//     ]
// }).then(model => {
//     console.log(util.inspect(model.dataValues, false, 3));
// }).catch(e => console.log(e));

// Model.findAll({ include: [{ all: true }]}).then(models => {
//     console.log(models);
// }).catch(e => console.log(e));