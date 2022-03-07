const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
       cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
}); 

const upload = multer({storage: storage});


const Movie = require('../models/movie');
const Actor = require('../models/actor');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    Movie.find()
        .select('name genre actors movieImage business_done reviews Rating _id ')
        .populate('actors')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                 movie:  result.map(res => {
                    return {
                        name: res.name,
                        genre: res.genre,
                        actor: res.actors,
                        movieImage: res.movieImage,
                        business_done: res.business_done,
                        reviews: res.reviews.map(result => {
                            return result
                        }),
                        rating: res.Rating,
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
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', upload.any('movieImage'), (req, res, next) => {
    console.log(req.files[0].path); 
    actor = JSON.parse(req.body.actorID);
    actor.map(result => { 
        console.log(result)
        Actor.findById(result)
            .then(actor => {
                if (!actor) {
                    return res.status(404).json({
                        message: "Actor Not Found"
                    })
                }
                const movie = new Movie({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    genre: req.body.genre,
                    actors: result,//mongoose.Types.ObjectId(result),
                    movieImage: req.files[0].path,
                    business_done: req.body.business_done,
                    reviews: req.body.reviews,
                    Rating: req.body.rating
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
                        movieImage: result.movieImage,
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
                console.log(err)
                return res.status(500).json(
                    {   
                    error: err
                })
            })
    }) 

});

router.get('/:id',  (req, res, next) => {
    const id = req.params.id;

    Movie.findById(id)
        .select('name genre actors movieImage business_done reviews Rating _id')
        .populate('actors')
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

router.patch('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
  
    Movie.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
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


router.delete('/:id',  (req, res, next) => {
    const id = req.params.id;


    Movie.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Movie Deleted!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/movies/',
                    data: { name: 'String', genre: 'String', actors: 'String', business_done: "String" }
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