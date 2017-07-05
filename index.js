const express = require('express');
const app = express();
const router = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router); //Since authentication is declared above blogs so the middleware that we have used inside authentication is also gonna work for blogs route
const blogs = require('./routes/blogs')(router);
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log("Sorry could not connect to database", err);
    } else {
        console.log("Successfully connected to database", config.db);
        //console.log(config.secret);
    }

});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/')); // Provide static directory for frontend
app.use('/authentication', authentication); // Use Authentication routes in application
app.use('/blogs', blogs); // Use Blog routes in application
app.use(morgan('combined'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});