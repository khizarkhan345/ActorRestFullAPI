const express = require('express');
const  mongoose = require('mongoose');
const router = express.Router();
const Actor = require('../models/actor');

router.get('/', (req, res, next) => {
   
     Actor.find()
     .select('name age gender _id')
     .exec()
     .then(result => {
         const response = {
             count: result.length,
             actor: result.map(res => {
               return {
                   name: res.name,
                   age: res.age,
                   gender: res.gender,
                   _id: res._id,
                   request: {
                       type: 'GET',
                       url: 'http://localhost:3000/actors/' + res._id
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

router.post('/', (req, res, next) => {

    const actor = new Actor({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender
    })
    actor.save()
    .then(result => {

        res.status(201).json({
            message: 'Actor created successfully!',
            actor: {
                name: result.name,
                age: result.age,
                gender: result.gender,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/actors/' + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });

});
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    
    Actor.findById(id)
    .select('name age gender _id')
    .exec()
    .then(result => {
        console.log("from database", result)
        res.status(200).json({
            actor: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/actors/'
            }
        })
    })
    .catch(err => {
       console.log(err)
       res.status(500).json(err)
    })
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value; 
    }
    Actor.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Actor Updated!',
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
   
    Actor.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Actor Deleted!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/actors/',
                data: {name: 'String', age: 'Number', gener: 'String'}
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