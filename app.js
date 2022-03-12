const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const formidable = require('express-formidable');
const { auth } = require('express-openid-connect');
const {engine} = require('express-handlebars');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
 
const actorRoutes = require('./api/routes/actors');
const movieRoutes = require('./api/routes/movies');
const userRoutes = require('./api/routes/users');


let connection = mongoose.connect("mongodb+srv://khizar123:"+process.env.MONGODB_PASSWORD+"@api-mongodb.88z8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 
); 
 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
//app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/actorImages', express.static('/actorImages'));
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