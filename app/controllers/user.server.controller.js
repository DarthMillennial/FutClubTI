module.exports = function (app) {
    var User = require('mongoose').model('User'),
        passport = require('passport'),
        config = require('../../config/config'),
        OAuth = require('oauth').OAuth,
        oauth;


    var controller = {};
    
    ///:: Retorna uma mensagem de erro
    var getErrorMessage = function (err) {
        var message = '';
        if (err.code) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Something went wrong';
            }
        }
        else {
            for (var errName in err.errors) {
                if (err.errors[errName].message)
                    message = err.errors[errName].message;
            }
        }

        return message;
    };
    
    ///:: Registra do provider fut.club um usuário no banco de dados
    controller.register = function (req, res, next) {

        if (!req.user) {
            var user = new User(req.body);
            var message = null;
            user.provider = 'local';
            user.username = user.name;
            user.save(function (err) {
                if (err) {
                    var message = getErrorMessage(err);
                    req.flash('error', message);
                    return res.redirect('/sys#/register');
                }

                req.login(user, function (err) {
                    if (err)
                        return next(err);

                    return res.redirect('/#/');
                });
            });
        }
        else {
            return res.redirect('/');
        }
    };
    
    ///:: Salva o perfil vindo da authenticação OAuth no banco
    controller.saveOAuthUserProfile = function (req, profile, done) {
        User.findOne({
            provider: profile.provider,
            providerId: profile.providerId
        },
            function (err, user) {
                if (err) {
                    return done(err);
                }
                else {
                    if (!user) {
                        var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
                        User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                            profile.username = availableUsername;

                            user = new User(profile);

                            user.save(function (err) {
                                if (err) {
                                    var message = _this.getErrorMessage(err);
                                    req.flash('error', message);
                                    return res.redirect('/signup');
                                }

                                return done(err, user);
                            });
                        });
                    }
                    else {
                        return done(err, user);
                    }
                }
            }
            );
    };
    
    ///:: Faz logout do sistema
    controller.logout = function (req, res) {
        req.logout();
        res.redirect('/');
    };
    
    ///: Busca o arquivo de idioma do sistema
    controller.setLanguage = function (req, res, language) {

        var languageCheck = language.split(",");

        if (languageCheck[0].indexOf("pt-BR") != -1)
            res.json(require('../utils/languages/lang.br.json'));
        else if (languageCheck[0].indexOf("en-US") != -1)
            return res.json(require('../utils/languages/lang.us.json'));
        else
            return res.json(require('../utils/languages/lang.br.json'));
        //return res.json(require('../utils/languages/lang.us.json'));

    }
    
    ///:: Inicia as configurações para autenticação com o twitter
    controller.initTwitterOauth = function () {
        oauth = new OAuth(
            "https://twitter.com/oauth/request_token",
            "https://twitter.com/oauth/access_token",
            config.twitter.clientID,
            config.twitter.clientSecret,
            "1.0A",
            config.twitter.callbackURL,
            "HMAC-SHA1"
            );
    }
    controller.initTwitterOauth();
    
    ///:: Busca os usuário no twitter (retorna todo os IDs de seus amigos)
    controller.getTwitterFriends = function (req, res) {
        oauth.get(
            'https://api.twitter.com/1.1/friends/ids.json',
            req.user.providerData.token,
            req.user.providerData.tokenSecret,
            function (e, data, res) {
                if (e) console.error(e);
                console.log(require('util').inspect(data));

            });
    }
    
    ///:: Constroi o objeto de amigos
    controller.userFriendsObject = function (req, res) {
        var aux = [];

        User.findOne({ providerId: req.user.providerId }).exec()
            .then(
            function (me) {
                var actualFriends = [];

                if (me.friends instanceof Array)
                    actualFriends = me.friends;
                else
                    actualFriends.push(me.friends)

                for (var i = 0; i < actualFriends.length; i++) {
                    var promise = User.findOne({ providerId: actualFriends[i] }).exec()
                        .then(function (user) {
                        if (user != null) {
                            aux.push({
                                id: user.providerId,
                                name: user.name.split(' ')[0],
                                provider: user.provider,
                                image: user.profileImage
                            })
                        }
                    },
                        function (err) {
                            console.log(err.message);
                            res.status(404).json(err);
                        });
                };

                return promise;
            },
            function (err) {
                debugger;
                console.log(err.message);
                res.status(404).json(err);
            }
            )
            .then(function () { res.json(aux); })



    };
    
    ///:: adiciona um novo amigo no banco de dados
    controller.addNewFriends = function (req, users) {
        for (var i = 0; i < users.length; i++) {

            User.update(
                { providerId: req.user.providerId },
                {
                    $push: { friends: users[i] }
                },
                function (err) {
                    if (err) {
                        return 'error: ' + err
                    }
                });
        }
    };
    
    ///:: Filtra e adiciona os novos usuários
    controller.filterNewUsers = function (req, res) {
        var aux = [];

        User.findOne({ providerId: req.user.providerId }).exec()
            .then(
            function (me) {
                var actualFriends = [];

                if (req.query.friends instanceof Array)
                    actualFriends = req.query.friends;
                else
                    actualFriends.push(req.query.friends)

                
                for (var i = 0; i < actualFriends.length; i++) {
                    var promise = User.findOne({ providerId: actualFriends[i] }).exec()
                        .then(
                        function (result) {

                            if (result != undefined) {

                                if (me.friends.indexOf(result.providerId) == -1) {
                                    aux.push(result.providerId);
                                }
                            }
                        },
                        function (err) {
                            console.log(err);
                            res.status(404).json(err);
                        }
                        )
                };

                return promise;
            },
            function (err) {
                console.log(err);
                res.status(404).json(err);
            }
            )
            .then(function () { controller.addNewFriends(req, aux) });
    };
    
    ///:: Adicionar um novo jogador a uma partida
    controller.addUserToMatch = function (req, res, match, user) {
        User.update(
            { providerId: req.user.providerId, "match.id": match },
            {
                $push: { "match.players": user }
            },
            function (err) {
                if (err) {
                    return 'error: ' + err
                }
            });
    };
    
    ///:: Pedir para jogar em uma partida
    controller.sendNotificationToMatchLeader = function (req, res, leader, match, notification) {
        User.update({ providerId: leader, "match.id": match },
            {
                $push: { notification: notification }
            },
            function (err) {
                if (err) {
                    return 'error: ' + err
                }
            });
    };
    
    ///:: Criar Partida
    controller.createMatch = function (req, res, match) {
        
        
       var promise = User.update(
            { providerId: req.user.providerId },
            {
                $push: { match: match }
            },
            function (err, user) {
                if (err) {
                    return 'error: ' + err
                }
                res.json(user);
            });

       return promise;
    };
    
    ///:: Enviar Pedido de Amizade
    controller.sendNotificationFriendship = function (req, res, to) {

    };
    
    ///:: Responder Pedido de Amizade
    controller.reponseNotificationFriendship = function (req, res, to) {

    };
    
    ///:: Editar Partida
    controller.updateMatch = function (req, res, match) {

    };

    return controller;

}