const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    genre: {type: String, required: true},
    actors: {type: mongoose.Schema.Types.ObjectId, ref: 'Actor'},
    business_done: {type: Number, required: true},
    reviews: {type: String},
    Rating: {type: Number}
});

module.exports = mongoose.model('Movie', movieSchema);