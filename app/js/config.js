angular.module('mudHowlers', [
  'ui.router',
  'ngAnimate',
  'sticky',
  'firebase'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home/landing');
	$stateProvider.
  state('home', {
    abstract: true,
    url: '/home',
    templateUrl: 'views/home-view.html',
    controller: 'homeCtrl'
  }).
  state('home.landing', {
    url: '/landing',
    templateUrl: 'views/landing-view.html',
    controller: 'landingCtrl'
  }).
  state('home.about', {
    url: '/about',
    templateUrl: 'views/about-view.html',
    controller: 'aboutCtrl'
  }).
  state('home.journal', {
    url: '/journal',
    templateUrl: 'views/journal-view.html',
    controller: 'journalCtrl'
  }).
  state('home.media', {
    url: '/media',
    templateUrl: 'views/media-view.html',
    controller: 'mediaCtrl'
  }).
  state('home.gigs', {
    url: '/gigs',
    templateUrl: 'views/gigs-view.html',
    controller: 'gigsCtrl'
  }).
  state('home.contact', {
    url: '/contact',
    templateUrl: 'views/contact-view.html',
    controller: 'contactCtrl'
  });
}]);
