const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log("Sorry could not connect to database", err);
    } else {
        console.log("Successfully connected to database", config.db);
        //console.log(config.secret);
    }

});

app.use(express.static(__dirname + '/client/dist/'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client/dist/index.html');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});