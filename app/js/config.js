angular.module('mudHowlers', [
  'ui.router',
  'ngAnimate',
  'sticky',
  'firebase'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home/about');
	$stateProvider.
  state('home', {
    abstract: true,
    url: '/home',
    templateUrl: 'views/home-view.html',
    controller: 'homeCtrl'
  }).
  state('home.about', {
    url: '/about',
    templateUrl: 'views/about-view.html',
    controller: 'aboutCtrl'
  }).
  state('home.journal', {
    url: '/journal',
    templateUrl: 'views/journal-view.html',
    controller: 'homeCtrl'
  }).
  state('home.contact', {
    url: '/contact',
    templateUrl: 'views/contact-view.html',
    controller: 'contactCtrl'
  });
}]);
