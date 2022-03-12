//const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const request = require('request');
const Axios = require('axios');
const app = require('../firebase/firebase');
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './actorImages');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });




const Actor = require('../models/actor');
const checkAuth = require('../middleware/check-auth');
const { response } = require('express');

router.get('/', (req, res, next) => {

    Actor.find()
        .select('name age gender actorImage _id')
        .exec()
        .then(result => {
            var response = {
                count: result.length,
                actor: result
                //  result.map(res => {
                //    return {
                //        name: res.name,
                //        age: res.age,
                //        gender: res.gender,
                //        _id: res._id,
                //        request: {
                //            type: 'GET',
                //            url: 'http://localhost:3000/actors/' + res._id
                //        }
                //    }
                //  }) 

            }
            
            response = [response];

            var results = {};

            const page = req.query.page;
            const limit = req.query.limit;
           
            const startIndex = (page-1)*limit;
            const endIndex = (page)*limit;
            console.log(response[0].actor.length)
            if(startIndex > response[0].actor.length){
             return  res.status(401).json({
                    message: "Page number is greater than number of records"
                })
            }

            results = response[0].actor.slice(startIndex, endIndex);

           return res.status(201).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', upload.any('actorImage'), (req, res, next) => {

    const actor = new Actor({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        actorImage: req.files[0].path
    })
    actor.save()
        .then(result => {
            
            const storageRef = app.storage().bucket(`gs://moviedb-e8ee9.appspot.com`);

                storageRef.upload(`${req.files[0].path}`, {
                    public: true,
                    destination: `/uploads/actorImages/${req.files[0].originalname}`,
                    metadata: {
                        firebaseStorageDownloadTokens: uuidv4(),
                    }
                })
                .then((result) => {
                    console.log("Image uploaded to firebase");
                })
            res.status(201).json({
                message: 'Actor created successfully!',
                actor: {
                    name: result.name,
                    age: result.age,
                    gender: result.gender,
                    actorImage: result.actorImage,
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

router.get('/user', (req, res, next) => {
    const BASE_URL = 'https://dummyapi.io/data/v1';
    const APP_ID = "62284ded07de6e965b4a8845";


    Axios({
        method: 'get',
        url: `${BASE_URL}/user?limit=100`,
        headers: { 'app-id': APP_ID }
    })
        .then((response) => {
            //console.log(response.data)
            const data = response.data['data'];
            const new_data = [];
            //console.log(data[0].title);
            data.forEach((d) => {
                const name = d.firstName + ' ' + d.lastName;
                const gender = d.title === 'mr' ? 'Male' : 'Female';
                const age = 25;
                const actorImage = d.picture;
                new_data.push({ name: name, age: age, gender: gender, actorImage: actorImage });

                //    const actor = new Actor({
                //     _id: new mongoose.Types.ObjectId(),
                //     name: name,
                //     age: age,
                //     gender: gender,
                //     actorImage: actorImage
                // })
                // actor.save()
                // .then(result => {

                //     res.status(201).json({
                //         message: 'Actor created successfully! from API',
                //     })
                // }).catch(err => {
                //     console.log(err)
                //     res.status(500).json({
                //         error: err
                //     })
                // });
            })
            console.log(new_data);
            new_data.forEach((dat) => {
                const actor = new Actor({
                    _id: new mongoose.Types.ObjectId(),
                    name: dat.name,
                    age: dat.age,
                    gender: dat.gender,
                    actorImage: dat.actorImage
                })
                actor.save()
                // .then(result => {

                //     res.status(201).json({
                //         message: 'Actor created successfully! from API',
                //     })
                // }).catch(err => {
                //     console.log(err)
                //     res.status(500).json({
                //         error: err
                //     })
                // });
            })
            return res.status(200).json({
                message: "Data fetched"
            })
        })
        .catch((err) => {
            console.log("Error occured")
            console.log(err);
            return res.status(400).json({
                message: "Error occured"
            })
        })
  


})

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Actor.findById(id)
        .select('name age gender actorImage _id')
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

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Actor.updateOne({ _id: id }, { $set: updateOps })
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


// router.delete('/:id', (req, res, next) => {
//     const id = req.params.id;

//     Actor.remove({_id: id})
//     .exec()
//     .then(result => {
//         res.status(200).json({
//             message: 'Actor Deleted!',
//             request: {
//                 type: 'POST',
//                 url: 'http://localhost:3000/actors/',
//                 data: {name: 'String', age: 'Number', gener: 'String'}
//             }
//         })
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({
//             error: err
//         })
//     })
// })


module.exports = router;