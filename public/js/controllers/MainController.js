angular.module('futclub').controller('MainController', function ($scope, $location, User, LanguageService, FacebookService, TwitterService, $q, $timeout, $compile) {
    
    ///:: Propriedas usadas na tela de Encontrar Jogadores!
    $scope.find_players_id = null;
    $scope.find_players_name = null;
    $scope.find_players_image = null;
    $scope.find_players_positions = null;
    $scope.find_players_city = null;
    
    ///:: Lista de amigos
    $scope.friends = [];
    
    ///:: Lista de amigos para a partida 
    selectedFriends = [];
    
    ///:: Parametros para utilização do google maps
    $scope.resultMapsSearch = '';
    $scope.resultMapsOptions = null;
    $scope.resultMapsDetails = '';
    
    ///:: Lista para receber o escopo
    $scope.myScope = [];
    
    ///:: Método de inicialização da controller
    $scope.init = function () {
        $scope.getMyScope();
    }
    
    ///:: Trocar a view que está na página
    $scope.ShowView = function (view) {
        $location.path(view);
    }
    
    ///:: Método de aguardar carregamento de tela
    $scope.loading = function () {

    }
    
    ///:: Busca o escopo do usuario logado
    $scope.getMyScope = function () {
        var promise = User.getMyScope.get();
        promise.$promise
            .then(function (result) { $scope.myScope = result; $scope.friends = result.friends; })
            .then(function () { return $scope.getFacebookFriends() })
            .then(function () { return $scope.updateFriends($scope.friends) })
    }
    
    ///:: Método para buscar os amigos atuais
    $scope.userFriendsObject = function () {
        var promise = User.actualFriends.query();
        promise.$promise.then(function (result) {
            $scope.myScope.friends = result;
            $scope.friends = result;
        }, function (reason) {
            alert(reason);
        });
        
        return promise;
    }
    
    ///:: Método para buscar os amigos, dependendo de qual rede social se logou
    $scope.getSocialFriends = function () {
        var deferred = $q.defer();
        deferred.promise
            .then(function () {
            if ($scope.myScope.provider == "facebook") {
                $scope.getFacebookFriends();
            }
            else if ($scope.myScope.provider == "twitter") {
                $scope.getTwitterFriends();
            }
        })
        
        deferred.resolve();

    }
    
    ///:: Atualiza os amigos no banco de dados
    $scope.updateFriends = function (friends) {
        var promise = User.updateFriends.get({ friends: friends });
        promise.$promise.then(function (result) {
            $scope.myScope.friends = result;
        }, function (reason) {
            console.log(reason);
        });
        
        return promise;
    }
    
    ///:: Seleciona amigos do facebook
    $scope.getFacebookFriends = function () {
        var promise = FacebookService.getFriends();
        promise.then(function (results) {
            for (var i = 0; i < results.data.length; i++) {
                $scope.friends.push(results.data[i].id);
            }
        }, function (reason) {
            
            console.log(reason);
        });
        
        return promise;
    }
    
    ///:: Seleciona amigos do twitter
    $scope.getTwitterFriends = function () {
        var promise = TwitterService.getFriends();
        promise.then(function (results) {
            for (var i = 0; i < results.data.length; i++) {
                $scope.friends.push(results.data[i].id);
            }
        }, function (reason) {
            debugger;
            console.log(reason);
        });
    }
    
    ///: Seleciona amigo para a partida
    $scope.selectFriend = function (id) {
        
        if (selectedFriends != null || selectedFriends != undefined) {
            if (selectedFriends.indexOf(id) == -1) {
                $('#' + id).addClass('mat-element-selected-players-active');
                selectedFriends.push(id);
            }
            else {
                var index = selectedFriends.indexOf(id);
                $('#' + id).removeClass('mat-element-selected-players-active');
                selectedFriends.splice(index, 1);
            }
        }
        else {
            $('#' + id).addClass('mat-element-selected-players-active');
            selectedFriends.push(id);
        }

    }
    
    ///:: Parametros para criar partida sem alugar quadra
    $scope.my_location_date = null;
    $scope.my_location_hour = null;
    $scope.my_location_private = null;
    $scope.my_location_msg = null;
    
    ///:: Abrir Popup convocar - alugando local
    $scope.openPopupWithRent = function (field) {
        $scope.fieldImages = field.images.split(';');
        
        
        var htmlContent = "<div class='soccer-fields-location' style='display:none'>" 
                          + "<form ng-submit='paymentPopup()'>" 
                              + "<div class='soccer-fields-location-header'>" 
                                + "<p>" + field.name + "</p>" 
                                + "<div class='soccer-fields-location-features'>" + field.field.type + " - " + field.field.features + " - " + field.phone + "</div>" 
                              + "</div>" 
                              + "<select class='soccer-fields-location-field'><option value='1'>Quadra 01</option></select>" 
                              + "<div class='soccer-fields-location-image-hour'>" 
                              + "<div class='soccer-fields-location-image'>" 
                              + "<ul class='bxslider soccer-fields-location-image' style='margin-right:10px;' >" 
                              + "<li ng-repeat='item in fieldImages'><img ng-src='{{item}}' /></li>" 
                              + "</ul>" 
                              + "</div>" 
                              + "<input id='soccer-fields-location-dateHour' type='text' class='soccer-fields-location-dateHour'>" 
                              + "</div>" 
                             // + "<textarea rows='6' cols='50' placeholder='Digite uma mensagem para os convocados' ng-model='my_location_msg'></textarea>" 
                               + "<div style='width: 58%;display: table;margin: 0 auto;margin-top: 3vw;'><button onclick='$(\".soccer-fields-location\").fadeOut();' type='button'>Cancelar</button><button type='submit' value='Submit'>Confirmar</button></div>" 
                               + "<div class='soccer-fields-location-price'>" + field.field.price + "/" + field.field.duration + "</div>" 
                          + "</form>" 
                            + "<script>$(document).ready(function () {$.datetimepicker.setLocale('pt'); $('#soccer-fields-location-dateHour').datetimepicker({format: 'd.m.Y H:i',inline: true,lang: 'pt-BR'});" 
        + "$('.bxslider').bxSlider({   mode: 'fade',captions: true});" 
    
                        + "});</script>" 
                          + "</div>";
        
        var compiled = $compile(htmlContent)($scope);
        $scope.$apply();
        $('.soccer-fields-location').remove();
        
        $('#mymap').prepend(compiled);
        
        $('.soccer-fields-location').fadeIn();

    }
    
    ///:: Popup de Pagamento (Simulação)
    $scope.paymentPopup = function () {
        var htmlContent = "<div class='fut-club-payment-background' style='display:none'>" 
                          + "<form class='fut-club-payment-form'>" 
                             + "<div class='fut-club-payment'>" 
                             + "<p class='fut-club-payment-title'>Pagamento</p>" 
                             + "<div class='fut-club-payment-cards'>" 
                                 + "<p>Usar cartão cadastrado</p>" 
                                 + "<input type='radio' name='card' value='65489' /><span>XXXX-XXXXX-XXXXX-65489</span>" 
                             + "</div>" 
                             + "<div class='fut-club-payment-data'>" 
                                + "<p>Número do Cartão: </p><input type='text' />" 
                                + "<p>Data Vencimento: </p><input type='text' />" 
                                + "<p>Verificação: </p><input type='text' />" 
                             + "</div>" 
                             + "<div style='width: 58%;display: table;margin: 0 auto;margin-top: 3vw;'><button onclick='$(\".fut-club-payment-background\").fadeOut();' type='button'>Cancelar</button><button type='submit' value='Submit'>Confirmar</button></div>" 
                             + "</div>" 
                         + "</form>" 
        + "</div>";
        
        var compiled = $compile(htmlContent)($scope);
        
        $('.fut-club-payment-background').remove();
        $('body').prepend(compiled);
        $('.fut-club-payment-background').fadeIn();
    }
    
    ///:: Abrir Popup convocar sem alugar local
    $scope.openPopupWithoutRent = function (latitude, logitude) {
        
        var htmlContent = "<div class='my-location' style='display:none'>" 
                    + "<form class='my-location-form' ng-submit='inviteFriendsWithoutRent(" + latitude + ", " + logitude + ")'>" 
                    + "<p>Criar Partida</p>" 
                    + "<input type='text' class='my-location-date' ng-model='my_location_date' name='my-location-date' style='margin-top:1vw;' placeholder='Digite a data' required><br>" 
                    + "<input type='text'class='my-location-hour' ng-model='my_location_hour' name='my-location-hour' placeholder='Digite a hora' required>" 
                    + "<div class='private-match'>Partida Privada ?</div><br>" 
                    + "<div style='    display: table;margin: 0 auto;width: 58%;'><input type='radio' ng-model='my_location_private' name='my-location-private' value='yes' required><span style='float: left;font-size: 1.5vw;margin-left: 1vw;'> Sim </span><input type='radio' ng-model='my_location_private' name='my-location-private' value='no' required><span style='float: left;font-size: 1.5vw;margin-left: 1vw;'> Não </span></div><br>" 
                    + "<textarea rows='4' cols='50' placeholder='Digite uma mensagem para os convocados' ng-model='my_location_msg'></textarea>" 
                    + "<div style=''><button onclick='$(\".my-location\").fadeOut()'' type='button'>Cancelar</button><button type='submit' value='Submit'>Confirmar</button></div>" 
                    + "</form>" 
        + "</div>";
        
        var compiled = $compile(htmlContent)($scope);
        $('.my-location').remove();
        $('#mymap').prepend(compiled);
        
        $('.my-location').fadeIn();

    }
    
    ///:: Convoca amigos sem alugar um local
    $scope.inviteFriendsWithoutRent = function (latitude, logitude) {
        if (selectedFriends == null || selectedFriends == undefined || selectedFriends.length <= 0) {
            $scope.customAlert('Cartão Amarelo', 'Você não convocou ninguém =(', 'yellow');
        }
        else {
            var match = {
                location: { latitude: latitude, logitude: logitude },
                date: $scope.my_location_date,
                hour: $scope.my_location_hour,
                'private': $scope.my_location_private,
                msg: $scope.my_location_msg,
                players: selectedFriends
            }
            
            
            
            var promise = User.createMatch.save({ match: match });
            
            promise.$promise.then(function () {
                console.log('deu certo');
                $scope.customAlert('Boa Jogada', 'Partida criada com sucesso!', 'green')
                
                $(".my-location").fadeOut();
                
                for (var i = 0; i < selectedFriends.length; i++) {
                    $('#' + selectedFriends[i]).removeClass('mat-element-selected-players-active');
                }
                
            }, function (reason) {
                console.log('deu errado');
                console.log(reason);
            })
            return promise;
        }
    }
    
    ///:: Escolhe a linguagem do sistema
    function findLanguage(lang) {
        LanguageService.get({ lang: lang },
            function (language) {
            $scope.language = language;
            $scope.mensagem = {};
        },
            function (erro) {
            $scope.mensagem = { texto: 'Wasnt possible load idiom' };
        });
    }
    
    findLanguage();
    
    ///::Pedir amizade
    $scope.inviteAddFriends = function (title, msg, id) {
        var htmlContent = "<div style='display:none' class='fut-club-alert-background-yesno' ng-controller='MainController'>" 
            + "<div class='fut-club-alert-yesno'>" 
            + "<span class='fut-club-alert-yesno-title'>" + title + "</span><br>" 
            + "<span class='fut-club-alert-yesno-msg'>" + msg + "</span>" 
            + "<div class='fut-club-alert-yesno-cancel' onclick='$(\".fut-club-alert-background-yesno\").fadeOut()'><span>Cancelar</span></div>" 
            + "<div class='fut-club-alert-yesno-confirm' ng-click='customAlert(\"Boa Jogada\", \"convite de amizade enviado com sucesso\", \"green\")'><span>Confirmar</span></div>" 
            + "</div>" 
            + "</div>";
        
        var compiled = $compile(htmlContent)($scope);
        
        $('.fut-club-alert-background-yesno').remove();
        $('body').prepend(compiled);
        
        $('.fut-club-alert-background-yesno').fadeIn();
    }
    
    ///:: Convocar jogador para partida
    $scope.summonPlayer = function () {
        
        $scope.matches = [
            {
                "id": "1",
                "date": "08/05/2016",
                "hour": "14:00",
                "local": "Rua Paulo Limoeiro, 107 - Vila Terezinha"
            },
            {
                "id": "2",
                "date": "10/05/2016",
                "hour": "14:00",
                "local": "Rua Paulo Limoeiro, 107 - Vila Terezinha"
            }
        ]
        
        var htmlContent = "<div style='display:none' class='fut-club-summon-player-background'>" 
                            + "<div class='fut-club-summon-player'>" 
                               + "<span class='fut-club-summon-player-title'>Para qual partida?</span>" 
                               + "<div class='fut-club-summon-player-matches'>" 
                                    + "<div class='fut-club-summon-player-match' ng-repeat='mat in matches'>" 
                                     + "<div style='float:left;width:20%;'>" 
                                        + "<span class='fut-club-summon-player-match-date'>{{mat.date}}</span>" 
                                        + "<span class='fut-club-summon-player-match-hour'>{{mat.hour}}</span>" 
                                     + "</div>" 
                                        + "<div style='float:left;width:80%;'>" 
                                            + "<span class='fut-club-summon-player-match-local'>{{mat.local}}</span>" 
                                            + "<span class='fut-club-summon-player-match-confirm'>Convidar</span>" 
                                        + "</div>" 
                                    + "</div>" 
                               + "</div>" 
                                + "<div class='fut-club-summon-player-cancel' onclick='$(\".fut-club-summon-player-background\").fadeOut()'><span>Cancelar</span></div>" 
                            + "</div>" 
                        + "</div>";
        
        var compiled = $compile(htmlContent)($scope);
        
        $('.fut-club-summon-player-background').remove();
        $('body').prepend(compiled);
        
        $('.fut-club-summon-player-background').fadeIn();
    }
    
    ///:: Envia um alerta para o usuário
    $scope.customAlert = function (title, msg, typeAlert) {
        
        var htmlContent = "<div style='display:none' class='fut-club-alert'>" 
            + "<div class='fut-club-alert-" + typeAlert + "'></div>" 
            + "<span class='fut-club-alert-title'>" + title + "</span><br>" 
            + "<span class='fut-club-alert-msg'>" + msg + "</span>" 
            + "<div class='fut-club-alert-close' onclick='$(\".fut-club-alert\").fadeOut()'>Fechar</div>" 
            + "</div>";
        $('.fut-club-alert-background-yesno').remove();
        $('.fut-club-alert').remove();
        $('body').prepend(htmlContent);
        
        $('.fut-club-alert').fadeIn();
    }
    
    ///:: Abre popup para filtro
    $scope.positionFilter = function () {
        
        var htmlContent = "<div class='fut-club-find-players-positions' style='display:none'></div>"
        
        var compiled = $compile(htmlContent)($scope);
        
        //$('.fut-club-find-players-positions').remove();
        $('.find-players-by-position').after(compiled);
        
        $('.fut-club-find-players-positions').fadeIn();
    }
    
});
