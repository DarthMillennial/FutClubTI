angular.module('futclub').factory('FacebookService', function ($resource, $q) {
    return {

        getFriends: function () {
            var deferred = $q.defer();

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    FB.api('/me/friends', {
                    }, function (response) {
                            if (!response || response.error) {
                                deferred.reject('Error occured');
                                console.log(response.error);
                        } else {
                                deferred.resolve(response);
                            }
                        });

                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                } else {
                    // the user isn't logged in to Facebook.
                }
            });
            return deferred.promise;

        }
    }
});

 