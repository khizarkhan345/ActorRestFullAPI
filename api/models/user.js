const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {
        type: String,
         required: true,
          unique: true,
           match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
         },
    phoneNo: {type: Number, required: true},
    password: {type: String, required: true},
    resetLink: {data: String, default: ''}
});

module.exports = mongoose.model('User', actorSchema);