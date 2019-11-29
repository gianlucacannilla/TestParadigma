const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const User = require('../models/user');
const autenticationMiddleware = require('../middlewares/auth');
const { checkValidation } = require('../middlewares/validation');

//ritornare tutti gli utenti (senza password)
router.get('/', function(req, res, next) {
  User.find({}, "-password", function(err, users){
    if (err) return res.status(500).json({error: err});
    res.json(users);
  });
});

//ritornare un utente (senza password)
router.get('/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, "-password", function(err, user){
    if (err) return res.status(500).json({error: err});
    if(!user) return res.status(404).json({message: 'User not found'})
    res.json(user);
  });
});

//creare un utente
router.post('/', [
  check('name').isString(),
  check('surname').isString(),
  check('email').isEmail(),
  check('password').isString().isLength({ min: 5 })
], checkValidation, function(req, res, next) {
  const newUser = new User(req.body);
  newUser.password = new Buffer(
      crypto.createHash('sha256').update(req.body.password, 'utf8').digest()
    ).toString('base64');
  newUser.save(function(err){
    if(err) {
      if (err.code === 11000) {
        return res.status(409).json(
          {
            error: "Invalid email",
            message: "This email is already taken"
          }
        );
      }
      return res.status(500).json({error: err});
    } 
    res.status(201).json(newUser);
  });
});

//aggiornare un utente
router.put('/:id', autenticationMiddleware.isAuth, function(request, response, next) {
  if (response.locals.authInfo.userId !== request.params.id) {
    return response.status(401).json({
      error: "Unauthorized",
      message: "You are not the owner of the resource"
    });
  }
  User.findOne({_id: request.params.id})
  .exec(function(err, user) {
    if(err) return response.status(500).json({error:err});
    if(!user) return response.status(404).json({message: 'User not found'})
    for(key in request.body) {
      user[key] = request.body[key];
    }
    user.save(function(err) {
      if(err) return response.status(500).json({error: err});
      response.json(user);
    });
  });
});

//eliminare un utente
router.delete('/:id', autenticationMiddleware.isAuth, function(req, res, next) {
  if (res.locals.authInfo.userId !== req.params.id) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You are not the owner of the resource"
    });
  }
  User.findOne({_id: req.params.id})
    .exec(function(err, user) {
      if(err) return res.status(500).json({error: err});
      if(!user) return res.status(404).json({message: 'User non found'});
      User.remove({_id: req.params.id}, function(err) {
        if(err) return res.status(500).json({error: err})
        res.json({message: 'User successfully deleted'})
      });
    });
});

//aggiungere un tweet nei preferiti
router.put('/addfavorites/:id1/:id2', autenticationMiddleware.isAuth, function(request, response, next) {
  if (response.locals.authInfo.userId !== request.params.id1) {
    return response.status(401).json({
      error: "Unauthorized",
      message: "You are not the owner of the resource"
    });
  }
  User.findOne({_id: request.params.id1})
  .exec(function(err, user) {
    if(err) return response.status(500).json({error:err});
    if(!user) return response.status(404).json({message: 'User not found'})
    for(key in request.body) {
      user[key] = request.body[key];
    }
    user.favorites.push(request.params.id2); 
    
    user.save(function(err) {
      if(err) return response.status(500).json({error: err});
      response.json(user);
    });
  });
});


//rimuovere un tweet dai preferiti
router.put('/removefavorites/:id1/:id2', autenticationMiddleware.isAuth, function(request, response, next) {
  if (response.locals.authInfo.userId !== request.params.id1) {
    return response.status(401).json({
      error: "Unauthorized",
      message: "You are not the owner of the resource"
    });
  }
  User.findOne({_id: request.params.id1})
  .exec(function(err, user) {
    if(err) return response.status(500).json({error:err});
    if(!user) return response.status(404).json({message: 'User not found'})
    for(key in request.body) {
      user[key] = request.body[key];
    }
    user.favorites.pull(request.params.id2); 
    user.save(function(err) {
      if(err) return response.status(500).json({error: err});
      response.json(user);
    });
  });
});

module.exports = router;