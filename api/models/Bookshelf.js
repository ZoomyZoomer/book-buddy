const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const bookEntrySchema = new Schema({
  volume_id: {
      type: String,
      required: true
  },
  rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
  },
  pages_read: {
      type: Number,
      min: 0
  },
  total_pages: {
      type: Number,
      min: 0
  }
});

const tabSchema = new Schema({

    tab_name: {
        type: String
    },
    books: [bookEntrySchema] // Embedded document for books

});

// Define the Bookshelf schema
const bookshelfSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  tabs: [tabSchema]
});

const BookshelfModel = model('Bookshelf', bookshelfSchema);

module.exports = BookshelfModel;