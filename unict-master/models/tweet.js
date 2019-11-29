const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    _author: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    tweet: {type: String, minlenght: 1, maxlenght: 280},
    created_at: {type: Date, default: Date.now()},
    parent_tweet: {type: String},       //Storia 1: id relativo al tweet "padre"
    likes: {type: Number, default: 0},  //Storia 2: numero relativo ai like di un tweert
    users_likes: {type: [String]},      //Storia 2: array di utenti (stringhe) che hanno messo like al tweet
    users_favorites: {type: [String]},  //Story 3: array di utenti (stringhe) che hanno messo preferito al tweet
    hashtags: {type: [String]}          //Story 4: array di stringhe per gli hashtags
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;