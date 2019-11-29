const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const Tweet = require('../models/tweet');
const User = require('../models/user');
const autenticationMiddleware = require('../middlewares/auth');
const { checkValidation } = require('../middlewares/validation');



router.get('/:id', function(req, res, next) {
  Tweet.findOne({_id: req.params.id})
    .populate("_author", "-password")
    .exec(function(err, tweet){
      if (err) return res.status(500).json({error: err});
      if(!tweet) return res.status(404).json({message: 'Tweet not found'})
      res.json(tweet);
    });
});

//crea tweet
router.post('/',autenticationMiddleware.isAuth, [
  check('tweet').isString().isLength({min: 1, max: 120}),
  //check('parent_tweet').exists({ checkNull: true })
], checkValidation, function(req, res, next) {
  const newTweet = new Tweet(req.body);
  
  newTweet._author = res.locals.authInfo.userId;
  //storia 4: inserisci gli hashtag nell'array hashtags
  newTweet.hashtags = newTweet.tweet.match(/#[a-z-0-9]+/gi);
  newTweet.save(function(err){
    if(err) {
      return res.status(500).json({error: err});
    } 
    res.status(201).json(newTweet);
  });
});

//crea commenti
router.post('/createcomment',autenticationMiddleware.isAuth, [
  check('tweet').isString().isLength({min: 1, max: 120}),
  //check('parent_tweet').exists({ checkNull: true })
  check('parent_tweet').isString()//non è necessario il controllo perchè c'è già un vincolo d'integrità lato front end
], checkValidation, function(req, res, next) {
  const newTweet = new Tweet(req.body);
  newTweet._author = res.locals.authInfo.userId;
  newTweet.save(function(err){
    if(err) {
      return res.status(500).json({error: err});
    } 
    res.status(201).json(newTweet);
  });
});

//Ritorna tutti i tweet
router.get('/', function(req, res, next) {
  Tweet.find({parent_tweet: null}).populate("_author", "-password").exec(function(err,tweets)
  /*Tweet.find().populate("_author", "-password").exec(function(err, tweets)*/{
    if (err) return res.status(500).json({error: err});
    res.json(tweets);
  });
});

//visualizzazione commenti
router.get('/showcomments/:id', function(req, res, next) {
 // Tweet.findOne({_id: req.params.id})
 Tweet.find({parent_tweet:req.params.id})
    .populate("_author", "-password")
    .exec(function(err, tweet){
      if (err) return res.status(500).json({error: err});
      if(!tweet) return res.status(404).json({message: 'Tweet not found'})
      res.json(tweet);
    });
});

//mettere like ,id1-> tweet ,id2->utente loggato
router.put('/addlike/:id1/:id2', autenticationMiddleware.isAuth, 
checkValidation, function(req, res, next) {
  Tweet.findOne({_id: req.params.id1}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
   
   
   tweet.likes =  tweet.likes + 1;
   tweet.users_likes.push(req.params.id2);
   
   //tweet.update({_id: req.params.id},{ $inc: { likes: 1 } });
   tweet.save(function(err) {
    if(err) return res.status(500).json({error: err});
    res.json(tweet);
   });
  });
});

//rimuovi like,id1-> tweet ,id2->utente loggato
router.put('/removelike/:id1/:id2', autenticationMiddleware.isAuth, 
checkValidation, function(req, res, next) {
  Tweet.findOne({_id: req.params.id1}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
   
   tweet.likes =  tweet.likes - 1;
   tweet.users_likes.pull(req.params.id2);
   //tweet.update({_id: req.params.id},{ $inc: { likes: 1 } });
   tweet.save(function(err) {
    if(err) return res.status(500).json({error: err});
    res.json(tweet);
   });
  });
});

//mostra tutti i like di un tweet
router.get('/showlikes/:id', function(req, res, next) {
  Tweet.findOne({_id:req.params.id})
  .exec(function(err, tweet){
       if (err) return res.status(500).json({error: err});
       if(!tweet) return res.status(404).json({message: 'Tweet not found'})
       res.json(tweet.likes.toString());
     });
 });

 //ritorno preferiti utente
 router.get('/myfavorites/:id', function(req, res, next) {
  User.findOne({_id:req.params.id})
  .exec(function(err, user){
       if (err) return res.status(500).json({error: err});
       if(!user) return res.status(404).json({message: 'User not found'})

       res.json(user.favorites);
     });
 });

  //ricerca tweet tramite hashtag  
  router.post('/showtweetsbytag/', function(req, res, next) {
  Tweet.find({hashtags:req.body.hashtags})
       .populate("_author", "-password")
       .exec(function(err, tweet){
         //if (err) return res.status(500).json({error: err});
         if (err) return res.send(req.param).json({error: err});
         if(!tweet) return res.status(404).json({message: 'Tweet not found'})
         res.json(tweet);
       })
   });

   

router.put('/:id', autenticationMiddleware.isAuth, [
  check('tweet').isString().isLength({min: 1, max: 120})
], checkValidation, function(req, res, next) {
  Tweet.findOne({_id: req.params.id}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
    if (tweet._author.toString() !== res.locals.authInfo.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are not the owner of the resource"
      });
    }
    tweet.tweet = req.body.tweet;
    tweet.save(function(err) {
      if(err) return res.status(500).json({error: err});
      res.json(tweet);
    });
  });
});



router.delete('/:id', autenticationMiddleware.isAuth, function(req, res, next) {
  Tweet.findOne({_id: req.params.id}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
    if (tweet._author.toString() !== res.locals.authInfo.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are not the owner of the resource"
      });
    }
    Tweet.remove({_id: req.params.id}, function(err) {
      if(err) {
        return res.status(500).json({error: err})
      }
      res.json({message: 'Tweet successfully deleted'})
    });
  });
});


module.exports = router;