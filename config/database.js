const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost/meanstackangular2',
    secret: crypto,
    db: 'meanstackangular2'
}