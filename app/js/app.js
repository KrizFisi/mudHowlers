var app = angular.module('mudHowlers', [
  'ui.router',
  'ngAnimate',
  'sticky',
  'firebase',
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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

app.controller('aboutCtrl', aboutCtrl);

aboutCtrl.$inject = ['$scope'];

function aboutCtrl ($scope){ };

app.controller('contactCtrl', contactCtrl);

contactCtrl.$inject = ['$scope'];

function contactCtrl ($scope){ };

app.controller('gigsCtrl', gigsCtrl);

gigsCtrl.$inject = ['$scope'];

function gigsCtrl ($scope){ };

app.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$document', '$state', '$window'];

function homeCtrl($scope, $document, $state, $window){

    var target = angular.element($window);
    target.bind('resize', function(){
      var currentSize = $document[0].body.offsetWidth;
      console.log(currentSize);
      if (currentSize >= 750){
        $scope.responsiveMenu = true;
        $scope.isSmall = false;
      }
      else{
        $scope.responsiveMenu = false;
        $scope.isSmall = true;
      }
    });

    var reloadSize = $document[0].body.offsetWidth;
    if (reloadSize >= 750){
      $scope.responsiveMenu = true;
      $scope.isSmall = false;
    }
    else{
      $scope.responsiveMenu = false;
      $scope.isSmall = true;
    }

    $scope.showMenu = function(){
      $scope.responsiveMenu = !$scope.responsiveMenu;
      $scope.isSmall = !$scope.isSmall
    };

    $scope.images = ['url(img/1.jpg)', 'url(img/2.jpg)', 'url(img/3.jpg)', 'url(img/4.jpg)', 'url(img/5.jpg)', 'url(img/6.jpg)'];
    var target = document.getElementById('welcome');
    $scope.welcome = angular.element(target);
    $scope.welcome.css(
      {'background-image': '' + $scope.images[Math.floor(Math.random() *      $scope.images.length)]}
    );

    $scope.checkUrl = function(url){
      switch(url){
        case 'about':
          $scope.aboutSelected = true;
          $scope.contactSelected = false;
          $scope.journalSelected = false;
          $scope.mediaSelected = false;
          $scope.gigsSelected = false;
          break;
        case 'contact':
          $scope.aboutSelected = false;
          $scope.contactSelected = true;
          $scope.journalSelected = false;
          $scope.mediaSelected = false;
          $scope.gigsSelected = false;
          break;
        case 'journal':
          $scope.aboutSelected = false;
          $scope.contactSelected = false;
          $scope.journalSelected = true;
          $scope.mediaSelected = false;
          $scope.gigsSelected = false;
          break;
        case 'media':
          $scope.mediaSelected = true;
          $scope.aboutSelected = false;
          $scope.contactSelected = false;
          $scope.journalSelected = false;
          $scope.gigsSelected = false;
          break;
        case 'gigs':
          $scope.gigsSelected = true;
          $scope.mediaSelected = false;
          $scope.aboutSelected = false;
          $scope.contactSelected = false;
          $scope.journalSelected = false;
          break;
        case 'landing':
          $scope.gigsSelected = false;
          $scope.mediaSelected = false;
          $scope.aboutSelected = false;
          $scope.contactSelected = false;
          $scope.journalSelected = false;
          break;
      }
    };
    $scope.initialUrl = $state.$current.url.source;
    $scope.checkUrl($scope.initialUrl.substring(6));
};

app.controller('journalCtrl', journalCtrl);

journalCtrl.$inject = ['$scope'];

function journalCtrl($scope){ };

app.controller('landingCtrl', landingCtrl);

landingCtrl.$inject = ['$scope'];

function landingCtrl ($scope){ };

app.controller('mediaCtrl', mediaCtrl);

mediaCtrl.$inject = ['$scope', '$state', '$firebase'];

function mediaCtrl($scope, $state, $firebase){ };
