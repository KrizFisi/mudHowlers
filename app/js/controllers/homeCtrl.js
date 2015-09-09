angular.module('mudHowlers').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$document', '$state', '$stateParams', '$window', '$firebase', 'anchorSmoothScroll'];

function homeCtrl($scope, $document, $state, $stateParams, $window, $firebase, anchorSmoothScroll){

  $scope.displayMenu = false;

  var target = angular.element($window);

  target.scrollY = 0;

  target.bind('scroll', function(){
    $scope.displayMenu = true;
    $scope.$apply();
  });

  target.bind('resize', function(){
    var currentSize = $document[0].body.offsetWidth;
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

  //$scope.images = ['url(img/1.jpg)', 'url(img/2.jpg)', 'url(img/3.jpg)', 'url(img/4.jpg)', 'url(img/5.jpg)', 'url(img/6.jpg)'];
  $scope.images = $firebase(new Firebase('https://mudhowlers.firebaseio.com/landingImages')).$asArray();
  $scope.images.$loaded().then(function(data){
    //console.log(data);
    var target = document.getElementById('welcome');
    $scope.welcome = angular.element(target);
    $scope.welcome.css(
      {'background-image': 'url(' + $scope.images[Math.floor(Math.random() * $scope.images.length)].src + ')'}
    );
  });




  $scope.checkUrl = function(url){
    var reloadSize = $document[0].body.offsetWidth;
    if (reloadSize >= 750){
      $scope.responsiveMenu = true;
      $scope.isSmall = false;
    }
    else{
      $scope.responsiveMenu = false;
      $scope.isSmall = true;
    }

    switch(url){
      case 'about':
        $scope.aboutSelected = true;
        $scope.contactSelected = false;
        $scope.journalSelected = false;
        $scope.mediaSelected = false;
        $scope.gigsSelected = false;
        //if(angular.element($window)[0].scrollY === 0){
          anchorSmoothScroll.scrollTo('targetScroll');
        //}
        break;
      case 'contact':
        $scope.aboutSelected = false;
        $scope.contactSelected = true;
        $scope.journalSelected = false;
        $scope.mediaSelected = false;
        $scope.gigsSelected = false;
        //if(angular.element($window)[0].scrollY === 0){
          anchorSmoothScroll.scrollTo('targetScroll');
        //}
        break;
      case 'journal':
        $scope.aboutSelected = false;
        $scope.contactSelected = false;
        $scope.journalSelected = true;
        $scope.mediaSelected = false;
        $scope.gigsSelected = false;
        //if(angular.element($window)[0].scrollY === 0){
          anchorSmoothScroll.scrollTo('targetScroll');
        //}
        break;
      case 'media':
        $scope.mediaSelected = true;
        $scope.aboutSelected = false;
        $scope.contactSelected = false;
        $scope.journalSelected = false;
        $scope.gigsSelected = false;
        //if(angular.element($window)[0].scrollY === 0){
          anchorSmoothScroll.scrollTo('targetScroll');
        //}
        break;
      case 'gigs':
        $scope.gigsSelected = true;
        $scope.mediaSelected = false;
        $scope.aboutSelected = false;
        $scope.contactSelected = false;
        $scope.journalSelected = false;
        if(angular.element($window)[0].scrollY === 0){
          anchorSmoothScroll.scrollTo('targetScroll');
        }
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
