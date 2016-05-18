//public/js/main.js
angular.module('futclub', ['ngRoute', 'ngResource', 'ngAutocomplete'])
 .config(function ($routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('MInterceptor');

    $routeProvider
    .when('/', {
        templateUrl: 'partials/Login.html',
        controller: 'MainController'
    })
    .when('/login', {
        templateUrl: 'partials/Login.html',
        controller: 'MainController'
    })
    .when('/menu', {
        templateUrl: 'partials/MainMenu.html',
        controller: 'MainController'
    })
    .when('/register', {
        templateUrl: 'partials/Register.html',
        controller: 'MainController'
    })
     .when('/match', {
        templateUrl: 'partials/Match.html',
        controller: 'MainController'
    })
     .when('/find-players', {
        templateUrl: 'partials/FindPlayers.html',
        controller: 'MainController'
    })
      .when('/find-matches', {
        templateUrl: 'partials/FindMatches.html',
        controller: 'MainController'
    })
   .otherwise({ redirectTo: '/' });
      
});