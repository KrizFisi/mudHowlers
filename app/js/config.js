angular.module('mudHowlers', [
  'ui.router'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider.
  state('home', {
    abstract: true,
    url: '/home',
    templateUrl: 'views/home-view.html',
    controller: 'homeCtrl'
  }).
  state('home.test', {
    url: '/test',
    templateUrl: 'views/about-view.html',
    controller: 'aboutCtrl'
  });
  /*
	state('first', {
		url: '/first',
		templateUrl: 'views/firstTemplate.html',
		controller: 'firstCtrl'
	}).
	state('second', {
		url: '/second',
		templateUrl: 'views/secondTemplate.html',
		controller: 'secondCtrl'
	}).
  state('about', {
    url: '/about',
    templateUrl: 'views/about-view.html',
    controller: 'aboutCtrl'
  })

  ;*/
}]);


var isLoggedIn = function($firebase, $state, firebaseRefFactory){
	var ref = new Firebase(firebaseRefFactory.getMainRef());
	var authData = ref.getAuth();
	if (authData) {
	  console.log("Authenticated user with uid:", authData.uid);
		return;
	}
	else{
		// send user to login state/route
		$state.go('login');
	}
};
