const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const Actor = require('../models/actor');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    Movie.find()
     .select('name genre actors business_done reviews Rating _id ')
     .populate('actors')
     .exec()
     .then(result => {
         const response = {
             count: result.length,
             movie: result.map(res => {
               return {
                   name: res.name,
                   genre: res.genre,
                   actors: res.actors,
                   business_done: res.business_done,
                   reviews: res.reviews,
                   rating: res.rating,
                   _id: res._id,
                   request: {
                       type: 'GET',
                       url: 'http://localhost:3000/movies/' + res._id
                   }
               }
             }) 

         }
         res.status(201).json(response)
     })
     .catch(err => {
         res.status(500).json({
             error: err
         })
     })
});
 
router.post('/',checkAuth, (req, res, next) => {
    Actor.findById(req.body.actorID)
    .then(actor => {
        if(!actor){
            return res.status(404).json({
                message: "Actor Not Found"
            })
        } 
        const movie = new Movie({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            genre: req.body.genre,
            actors: req.body.actorID,
            business_done: req.body.business_done,
            reviews: req.body.reviews,
            rating: req.body.rating
        });
      return movie.save()
    })
    .then(result => {
        res.status(201).json({
            message: 'Movie created successfully!',
            actor: {
                name: result.name,
                genre: result.genre,
                actors: result.actors,
                business_done: result.business_done,
                reviews: result.reviews,
                rating: result.rating,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/movies/' + result._id
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Movie.findById(id)
    .select('name genre actors business_done reviews rating _id')
    .exec()
    .then(result => {
        res.status(201).json({
            movie: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/movies/'
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value; 
    }
    Movie.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Movie Updated!',
            request: {
                type: 'PATCH',
                url: 'http://localhost:3000/actors/' + id
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

   
    Movie.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Movie Deleted!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/movies/',
                data: {name: 'String', genre: 'String', actors: 'String', business_done: "String"}
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;