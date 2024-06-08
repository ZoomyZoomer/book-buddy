const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ItemSchema = new Schema({
    item: {
        type: String
    },
    valid_locations: [String],
    quantity: {
        type: Number
    }
});

const InventorySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    items: [ItemSchema]
});

const InventoryModel = model('Inventory', InventorySchema);

module.exports = InventoryModel;