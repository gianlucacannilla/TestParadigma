const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    _author: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    tweet: {type: String, minlenght: 1, maxlenght: 280},
    created_at: {type: Date, default: Date.now()},
    parent_tweet: {type: String}, //Story 1: id related with the "father" tweet
    likes: {type: Number, default: 0}, //Story 2: number related to the likes of a tweet
    hashtags: {type: [String]}, //Story 4: array of strings for hashtags
    users_likes: {type: [String]} //array di persone che hanno messo mi piace
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;