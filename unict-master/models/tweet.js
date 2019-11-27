const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    _author: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    parent_tweet: {type: String, minlenght: 1, maxlenght: 280},
    tweet: {type: String, minlenght: 1, maxlenght: 280},
    created_at: {type: Date, default: Date.now()}
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;