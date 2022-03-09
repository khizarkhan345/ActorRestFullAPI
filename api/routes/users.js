const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
const mailgun = require("mailgun-js");
const nodeMailer = require('nodemailer');


const Movie = require('../models/movie');
const Actor = require('../models/actor');
const User = require('../models/user');
const { appendFile } = require('fs');

router.post('/signup', (req, res, next) => {
    // User.find({email: req.body.email})
    // .then(user => {
    //     if(user.length >=1){
    //         return res.status(409).json({
    //             message: 'User exists'
    //         })
    //     }else{

            const token = jwt.sign({name: req.body.name, email: req.body.email, password: req.body.password, phoneNO: req.body.phoneNo}, 'secret', {expiresIn: "20m"})

            // const data = {
            //     from: "noreply@test.com",
            //     to: req.body.email,
            //     subject: "Account activation Link",
            //     html: `
            //      <h2>Kindly, click on the following link to activate your account</h2>
            //      <a>http://localhost:3000/users/activate/${token}</a>
            //     `
            // };
            // mg.messages().send(data, function (error, body) {
            //     if(error){
            //         return res.json({error: error})
            //     }else{
            //         return res.json({message: "Email has been sent to client. Kindly, verify it"});
            //     }
            //     console.log(body);
            // });
            
            let testAccount = await nodeMailer.createTestAccount();
            console.log(testAccount);
            let data = {
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                  to: req.body.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
               }
  // create reusable transporter object using the default SMTP transport
           let transporter = nodeMailer.createTransport({
               host: "smtp.ethereal.email",
               port: 587,
              secure: false, // true for 465, false for other ports
             auth: {
                 user: testAccount.user, // generated ethereal user
                 pass: testAccount.pass, // generated ethereal password
           },
        });

  // send mail with defined transport object
             transporter.sendMail(data, function (error, body) {
                    if(error){
                        console.log(error);
                        return res.json({error: error})
                    }else{
                        return res.json({message: "Email has been sent to client. Kindly, verify it"});
                    }
                    console.log(body);
                });

                 
            // bcrypt.hash(req.body.password, 10, (err, hash) => {
            //     if(err) {
            //         return res.status(500).json({
            //             error: err
            //         })
            //     }else{
            //         const user = new User({
            //             _id: new mongoose.Types.ObjectId(),
            //             name: req.body.name,
            //             email: req.body.email,
            //             phoneNo: req.body.phoneNo,
            //             password: hash
            //         })
            //         user.save()
            //         .then(result => {
            //             console.log(result)
            //             res.status(201).json({
            //                 message: "User Created"
            //             })
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             res.status(500).json({
            //                 error: err
            //             })
            //         })
            //     }
            // })
    //     }
    // }) 
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

router.post('/activate', (req, res, next) => {
    const token = req.body.token;
    console.log(token);
    if(token){
        jwt.verify(token, 'secret', (err, decodedToken) => {
            console.log(err);
            if(err){
                return res.status(400).json("Incorrect or expired link");
            }

            const {name, email, password, phoneNO} = decodedToken;

     User.find({email: email})
      .then(user => {
        if(user.length >=1){
            return res.status(409).json({
                message: 'User exists'
            })
        }else{
              
             bcrypt.hash(password, 10, (err, hash) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: name,
                        email: email,
                        phoneNo: phoneNO,
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
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
                })
        }
    })
           
        })
       
    }else{
        
        return res.status(500).json({err: "Something went wrong"})
    }
    

})

router.put('/forgot-password', (req, res, next) => {
 
    User.findOne({email: req.body.email})
    .then((user) => {
        if(!user){
            return res.status(401).json({
                message: "User does not exist"
            })
        }
        const token = jwt.sign({_id: user._id}, 'secret', {expiresIn: "20m"})

        const data = {
            from: "noreply@test.com",
            to: req.body.email,
            subject: "Password Reset Link",
            html: `
             <h2>Kindly, click on the following link to reset your password</h2>
             <a>http://localhost:3000/users/resetPassword/${token}</a>
            `
        };

        return user.updateOne({resetLink: token})
         .then((result) => {
            mg.messages().send(data, function (error, body) {
                if(error){
                    return res.json({error: err})
                }else{
                    return res.json({message: "Email has been sent to you. Kindly, follow the instructions"});
                }
                //console.log(body);
            });
        })
        .catch((err) => {
            console.log(err)
            return res.status(401).json({
                error: err
            })
        })

    })
    .catch((err) => {
        console.log(err);
        return res.status(401).json({
            error: err
        })
    })
   
})

router.put('/reset-password', (req, res, next) => {
    if(req.body.resetLink){
       jwt.verify(req.body.resetLink, 'secret', (error, decodedToken) => {
           if(error){
               res.status(401).json({
                   err: "Incorrect token or it is expired!"
               })
           }
           User.findOne({resetLink: req.body.resetLink})
           .then((result) => {
        
            bcrypt.hash(req.body.newPass, 10, (err, hash) => {
                if(err){
                  return res.status(401).json({
                      error: err
                  })  
                }
                const obj = {
                    password: hash,
                    resetLink: ''
                }

                result = lodash.extend(result, obj)
            
                result.save()
               .then((result) => {
                  return res.status(200).json({
                     message: "Your password has been changed"
                  })
               })
               .catch((err) => {
                  console.log(err);
                  return res.status(401).json({
                     err: "Reset Password error"
                 })
              })
            })
           })
           .catch((err) => {
               console.log(err);
               return res.status(401).json({
                   err: "Something went wrong"
               })
           })
       })
    }else{
        console.log(err);
        res.status(401).json({
            message: "Authentication Error!"
        })
    }
})

router.get('/get-users', (req, res, next) => {
    User.find()
    .select('name email phoneNo password resetLink')
    .exec()
    .then((result) => {
        const response = {
            count: result.length,
             movie:  result.map(result1 => {
                return {
                    name: result1.name,
                    email: result1.email,
                    phoneNo: result1.phoneNo,
                    password: result1.password,
                    resetLink: result1.resetLink
                }
            })
        }
        return res.status(200).json(response);
    })
    .catch((err) => {
        res.status(401).json({
            message: "Unable to get user data"
        })
    })
})
module.exports = router;