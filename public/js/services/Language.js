angular.module('futclub').factory('LanguageService', function ($resource) {
	return $resource('/language', {lang: '@lang'});
});


