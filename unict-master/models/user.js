const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    favorites: {type: [String]}, //Story 3: array of strings for favorites
    hashtags: {type: [String]} //Story 4: array of strings for hashtags
});

const User = mongoose.model('User', userSchema);

module.exports = User;