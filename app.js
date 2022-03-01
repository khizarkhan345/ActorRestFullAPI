const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const formidable = require('express-formidable');
const app = express();
const actorRoutes = require('./api/routes/actors');
const movieRoutes = require('./api/routes/movies');
const userRoutes = require('./api/routes/users');

mongoose.connect();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
//app.use(formidable());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json();
    }
    next()
})
app.use('/actors', actorRoutes);
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found!');

    error.status(404);

    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;