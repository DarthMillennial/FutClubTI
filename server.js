process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var http = require('http'), 
    config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport'),
    app = require('./config/express');
    
var db = mongoose(),
    app = app(),
    passport = passport();

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express Server escutando na porta ' +
    app.get('port'));
});