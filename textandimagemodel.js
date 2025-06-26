// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  public_id: String,
});

module.exports = mongoose.model('Post', postSchema);
