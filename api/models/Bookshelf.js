const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const bookEntrySchema = new Schema({
  volume_id: {
      type: String,
      required: true
  },
  title: {
    type: String,
    required: true
  },
  cover: {
    type: String
  },
  author: {
    type: String
  },
  genre: {
    type: String
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

const genreColorSchema = new Schema({
    genre: {
      type: String,
      required: true
    },
    color: {
      type: String
    }
})

const bookshelfSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  tabs: [tabSchema],
  genre_colors: [genreColorSchema],
  color_collection: [],
  default_color: {
    type: String,
    required: true
  }
});

const BookshelfModel = model('Bookshelf', bookshelfSchema);

module.exports = BookshelfModel;