var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function () {
    var Player = mongoose.model('User');
    
    passport.serializeUser(function (player, done) {

        done(null, player.id);
    });
    
    passport.deserializeUser(function (id, done) {

        Player.findOne(
            { _id: id },
            '-password',
            function (err, player) {
                done(err, player);
            }
        );
    });

    
    require('./strategies/local.js')();
    require('./strategies/twitter.js')();
    require('./strategies/facebook.js')();
};
