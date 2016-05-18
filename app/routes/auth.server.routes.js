module.exports = function (app) {
    var controller = app.controllers.userServerController,
        passport = require('passport');
    
    
    //------------------  LOCAL LOGIN -------------------
    app.route('/login')
    .post(passport.authenticate('local', {
        successRedirect: '/main#/menu',
        failureRedirect: '/#/login',
        failureFlash: true
    }));
    //------------------  END LOCAL LOGIN -------------------
    
    //------------------  FACEBOOK LOGIN -------------------
    app.get('/oauth/facebook', passport.authenticate('facebook', {
        failureRedirect: '/login',
        scope: ['email', 'user_friends']
    }));
    
    
    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login',
        successRedirect: '/main#/menu',
        scope: ['email', 'user_friends']
    }));


    //------------------  END FACEBOOK LOGIN -------------------
    
    //------------------  TWITTER LOGIN -------------------
    app.get('/oauth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/login'
    }));
    
    app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/login',
        successRedirect: '/main#/menu',
    }));
    //------------------  END TWITTER LOGIN -------------------

    app.get('/logout', function (req, res) {
        req.logOut();
        res.redirect('/');
    });
};