const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true}
});

module.exports = mongoose.model('Actor', actorSchema);