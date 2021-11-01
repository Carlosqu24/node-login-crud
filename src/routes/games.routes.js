const express = require('express');
const router = express.Router();

// MODEL
const Game = require('../models/Game');

const { isAuthenticated } = require('../helpers/auth');


router.get('/games', isAuthenticated, async (req, res) => {
      
      const games = await Game.find().sort({ date: 'desc' }).lean();

      res.render('./games/all-games', { games });
});

router.get('/games/add', isAuthenticated, (req, res) => {
      res.render('./games/new-game');
});

router.post('/games/new-game', isAuthenticated, async (req, res) => {

      const { name, description } = req.body;

      const errors = [];

      if(!name) {
            errors.push({text: 'Please write a name'});
      };

      if(!description) {
            errors.push({text: 'Please write a description'});
      };

      if(errors.length > 0) {
            res.render('games/new-game', {
                  errors,
                  name,
                  description
            });
      } else {
            const newGame = new Game({ name, description });
            await newGame.save();

            req.flash('success_message', 'Note added succesfully');

            res.redirect('/games');
      }

});

router.get('/games/edit/:id', isAuthenticated, async (req, res) => {
      const gameToEdit = await Game.findById(req.params.id);

      const { _id, name, description } = gameToEdit

      res.render('./games/edit-game', { _id, name, description });
});

router.put('/games/edit-game/:id', isAuthenticated, async (req, res) => {
      const { name, description } = req.body;

      await Game.findByIdAndUpdate(req.params.id, { name, description });

      req.flash('success_message', 'Game updated successfuly');

      res.redirect('/games');
});

router.delete('/games/delete/:id', isAuthenticated, async (req, res) => {

      await Game.findByIdAndDelete(req.params.id)

      req.flash('success_message', 'Game deleted successfuly')

      res.redirect('/games')
});

module.exports = router;