const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    _author: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    tweet: {type: String, minlenght: 1, maxlenght: 280},
    created_at: {type: Date, default: Date.now()},
    parent_tweet: {type: String}, //Story 1: id related with the "father" tweet
    likes: {type: Number} //Story 2: number related to the likes of a tweet

});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;