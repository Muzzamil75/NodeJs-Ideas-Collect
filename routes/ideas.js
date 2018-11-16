const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// show all ideas of specific user
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user : req.user.id})
 // console.log(ideas)
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

//---------------------------------------------------------------- ADD Idea Form   GET REQUEST
router.get('/add',ensureAuthenticated ,(req, res) => {
  res.render('ideas/add');
  //console.log("main buton");
});


// ADDING Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  //console.log ("am in process form");

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    console.log ("Adding to database");

    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      })
  }
});

//--------------------------------------------------------- EDIT Idea Form  GET REQUEST
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
    
  });
});

// EditING Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea updated');
        //self calling of / function in this file
        res.redirect('/ideas');
      })
  });
});
//------------------------------------------------------------------------------------------
// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});

module.exports = router;