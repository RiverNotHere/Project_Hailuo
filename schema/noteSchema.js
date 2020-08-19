const mongoose = require('mongoose');
var time;

const noteSchema = new mongoose.Schema({
    noteAuthor: {type: String},
    draft: {type: Boolean},
    noteTitle: {type: String, required: true},
    noteCate: {type: String, required: true},
    noteKeyword: {type: Array, required: true},
    noteContent: {type: String, required: true},
})

const noteModel = module.exports = mongoose.model('notes', noteSchema, 'knowledges');