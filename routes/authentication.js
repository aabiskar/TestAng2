const User = require('../models/user');
const config = require('../config/database');
var validator = require('email-validator');
var isValidUsername = require('is-valid-username');
var jwt = require('jsonwebtoken');


module.exports = (router) => {

    router.post('/register', (req, res) => {
        console.log(req.body);
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.json({ success: false, message: "You must provide email,username and password" });
        } else if (!req.body.email) {
            res.json({ success: false, message: "You must provide an e-mail" });
        } else if (!validator.validate(req.body.email)) {
            res.json({ success: false, message: "Email not valid" });
        } else if (!isValidUsername(req.body.username)) {
            res.json({ success: false, message: "Invalid username" });
        } else if (!req.body.username) {
            res.json({ success: false, message: "You must provide the username" });
        } else if (!req.body.password) {
            res.json({ success: false, message: "You must provide the password" });
        } else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            user.save((err) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, message: "Account registered!" })
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.json({ success: false, message: "No username and password" });
        } else if (!req.body.username) {
            res.json({ success: false, message: "No username was provided" });
        } else if (!req.body.password) {
            res.json({ success: false, message: "No password was provided" });
        } else {
            User.findOne({ 'username': req.body.username }, function(err, user) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Username not found' })
                    }
                    const validPassword = user.comparePassword(req.body.password);

                    if (!validPassword) {
                        res.json({ success: false, message: 'Password Invalid' });
                    } else {
                        const token = jwt.sign({
                            userId: user._id,
                        }, config.secret, { expiresIn: '1h' });
                        console.log(token);
                        res.json({ success: true, message: 'Success', token: token, user: { username: user.username } });
                    }
                }
            })
        }
    });

    //Any routes that comes after this middleware are automatically gonna run this middleware. 
    //Since Login and Registration does not require token so they are put above this middleware
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        console.log('secret key is', config.secret);
        if (!token) {
            res.json({ success: false, message: 'No token Provided' });
        } else {
            var decoded = jwt.verify(token, config.secret, (err, decoded) => { //config.secret gets changed with every restart of server so it respond with "Invalid signature"
                if (err) {
                    res.json({ success: false, message: 'Token Invalid' + err });
                } else {
                    console.log(decoded);
                    req.decoded = decoded;
                    next();
                }
            });

        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if (err) {
                console.log('Error!! user not found' + err);
            } else if (!user) {
                res.json({ success: false, message: "User not found" });
            } else {
                res.json({ success: true, user: user })
            }
        })

    });


    return router;
}