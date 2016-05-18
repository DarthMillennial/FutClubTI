angular.module('futclub').factory('User', function ($resource, $q) {
    return {
        getMyScope: $resource('/user/check', {}),
        updateFriends: $resource('/user/update/friends', { friends: '@friends' }),
        actualFriends: $resource('/user/actual/friends', {}),
        createMatch: $resource('/user/create/match', {match:'@match'},  {method:'PUT'}),
        addUserToMatch: $resource('/user/add-player-to-match', {}),
        sendNotificationToMatchLeader: $resource('/user/ask-to-play-match', {})
    }
});