const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const QuestsSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true},
    daily1: [
        {
            finished: { type: Boolean },
            id: { type: String }
        }
    ],
    daily2: [
        {
            finished: { type: Boolean },
            id: { type: String }
        }
    ],
    daily3: [
        {
            finished: { type: Boolean },
            id: { type: String }
        }
    ]
});

const QuestsModel = model('Quests', QuestsSchema);

module.exports = QuestsModel;