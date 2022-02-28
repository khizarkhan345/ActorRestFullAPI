const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Movie = require('../models/movie');
const Actor = require('../models/actor');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .then(user => {
        if(user.length >=1){
            return res.status(409).json({
                message: 'User exists'
            })
        }else{

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        phoneNo: req.body.phoneNo,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: "User Created"
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
});
  // Login request
  router.post('/login', (req, res, next) => {
      User.find({email: req.body.email})
      .then(user => {
         if(user.length < 1){
             return res.status(404).json({
                 message: "Auth Failed!"
             })
         }
         bcrypt.compare(req.body.password, user[0].password, (err, response) => {
             if(err){
                return res.status(404).json({
                    message: "Auth Failed!"
                })
             }
             if(response){
                 const token = jwt.sign({
                     email: user[0].email,
                     id: user[0]._id
                 },
                 'secret',
                 {
                     expiresIn: "1h"
                 }
                 )
                return res.status(200).json({
                    message: "Auth Successfull!",
                    token: token
                })
             }
             return res.status(404).json({
                message: "Auth Failed!"
            })
         })
      })
      .catch(err => {
          res.status(500).json({
              error: err
          })
      })
  });

module.exports = router;