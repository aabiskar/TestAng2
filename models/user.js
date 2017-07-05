const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
});

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);


/* Hash the password before we save it to the database */
userSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);

        user.password = hash;

        next();
    });

});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Return comparison of Login password to password
    // of database (true or false)
}



module.exports = mongoose.model('User', userSchema)