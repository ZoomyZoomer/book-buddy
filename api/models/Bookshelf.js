const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  identifier: { type: String, required: true, unique: true },
  data: { type: [String], default: [] } // Array of strings to store ISBN numbers
});

const BookshelfModel = mongoose.model('Bookshelf', BookSchema);

module.exports = BookshelfModel;