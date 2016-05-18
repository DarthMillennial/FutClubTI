var port = 3000;

module.exports = {
    env: 'development',
    //db: 'mongodb://localhost/futclub',
    db: 'mongodb://futclubdb:SaLXKsISWap39mOHLQDXfB.rRrcImya6ZyAsqLSV09o-@ds030719.mlab.com:30719/futclubdb',
    clientID: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET,
    seleniumUser: process.env.SELENIUM_USER, 
    seleniumUserPassword: process.env.SELENIUM_USER_PASSWORD, 
    port: 3000, 
    address: 'localhost', 
    domain: 'localhost:3000',
    facebook: {
        clientID: '184471455247996',
        clientSecret: '756c85a387331633c7c19e48bdf1ee94',
        callbackURL: 'http://localhost:' + port + '/oauth/facebook/callback'
    },
    twitter: {
        clientID: 'C8KOPopAjci14QwEcHn73gCMk',
        clientSecret: 'pjfb6AUo5lq4cF4mE9zF25G9TzSBLDybmSQo8HVsUbh3LGWL8t',
        callbackURL: 'http://localhost:'+ port +'/oauth/twitter/callback'
    }
};
