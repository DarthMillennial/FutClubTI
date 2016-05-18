var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var helmet = require('helmet')
var flash = require('connect-flash');
var session = require('express-session');
var multer = require('multer');


module.exports = function () {
    var app = express();
    
    app.set('port', 3000);
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    
    
    app.use(express.static('./public'));
    
    ///:: Mudar para o caminho fisico onde ficarão as imagens dos clubes
    app.use('/images', express.static('C:\\files-images'));
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(require('method-override')());
    
    app.use(cookieParser());
    app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');
    
    load('models', { cwd: 'app' })
		.then('controllers')
		.then('routes/auth.js')
		.then('routes')
        .then('language')
		.into(app);
    
    app.get('*', function (req, res) {
        res.status(404).render('404');
    });
    
    return app;
};