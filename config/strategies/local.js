var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        console.log('Método passport.use');
        User.findOne(
            { username: username },
            function (err, player) {
                if (err) {
                    console.log('Erro:' + err);
                    return done(err);
                }
                
                if (!player) {
                    console.log('Unknown user');
                    return done(null, false, { message: 'Unknown user' });
                }
                
                if (!player.authenticate(password)) {
                    console.log('Senha inválida');
                    return done(null, false, { message: 'Invalid password' });
                }
                
                return done(null, player);
            }
        );
    }));
};