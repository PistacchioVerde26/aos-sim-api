const util = require('util');
const bodyParser = require('body-parser');

const { sequelize, Op } = require('./db/sequelize');
const { Model, MoveTable } = require('./models/Model');
const { Ability, AbiTable } = require('./models/Ability');
const { Weapon, DmgTable } = require('./models/Weapon');
const { Magic } = require('./models/Magic');
const { Miscs } = require('./models/Miscs');

