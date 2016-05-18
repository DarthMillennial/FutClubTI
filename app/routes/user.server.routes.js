///:: Verifica se o usuário está autorizado a entrar na página
function checkAuthorization(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status('401').json('Não autorizado');
    }
}

module.exports = function (app) {
    var controller = app.controllers.userServerController,
        passport = require('passport');
    
    ///:: Rota para o site institucional
    app.get('/', function (req, res) {
        res.render('site', {});
    });
    
    ///:: Rota para buscar o escopo do usuario conectado (pega do cache)
    app.get('/user/check', function (req, res) { res.send(req.isAuthenticated() ? req.user : '0'); });
    
    ///:: Rota para buscar informações no banco de dados do usuario conectado 
    app.route('/user')
        .get(function (req, res) {
        controller.getUser(req, res)
    });
    
    ///:: Rota para buscar os amigos atuais
    app.get('/user/actual/friends', function (req, res) {
        controller.userFriendsObject(req, res);
    })
        
    ///:: Rota para adicionar jogador em uma partida
    app.get('/user/add-player-to-match', function (req, res) {
        controller.addUserToMatch(req, res, req.query.match, req.query.user);
    })
    
    ///:: Rota para pedir para jogar em uma partida
    app.get('/user/ask-to-play-match', function (req, res) {
        controller.sendNotificationToMatchLeader(req, res, req.query.leader, req.query.match, req.query.notification);
    })
    
    ///:: Rota para update dos amigos
    app.get('/user/update/friends', function (req, res) {
        controller.filterNewUsers(req, res);
    })
    
    ///:: Rota para criar uma partida
    app.post('/user/create/match', function (req, res) {
        controller.createMatch(req, res, req.query.match);
    })
    
    ///:: Rota para buscar os amigos do twitter
    app.get('/user/twitterfriends', function (req, res) {
        controller.getTwitterFriends(req, res);
    });
    
    ///:: Rota para buscar a linguagem do sistema
    app.get('/language', function (req, res) {
        if (req.query.lang == undefined || req.query.lang == null)
            controller.setLanguage(req, res, req.headers["accept-language"]);
        else
            controller.setLanguage(req, res, req.query.lang);
    });
    
    ///:: Rota para o sistema
    app.route('/main')
        .get(checkAuthorization, function (req, res) {
        res.render('main', {
            user: req.user ? req.user.username : '',
            profileImage: req.user ? req.user.profileImage : ''
        });
    });
    
    ///:: Rota para tudo que for do lado de fora do sistema (sem contar o site). Ex: Tela de cadastro, esqueci minha senha
    app.route('/sys')
        .get(function (req, res) {
        res.render('register');
    })
        .post(controller.register);
};