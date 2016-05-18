angular.module('futclub').factory('TwitterService', function ($resource, $q, $http) {
    
    return {

        getFriends: function () {
            console.log('Twitter get Friends');
            var deferred = $q.defer();
            //  deferred.reject('Error occured');
            
            $http.get('/user/twitterfriends').success(function (results) {
                deferred.resolve(results);    
            }); 

            return deferred.promise; 
        }
    }

});


