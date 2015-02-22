angular.module('mudHowlers').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$document', '$state'];

function homeCtrl($scope, $document, $state){

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
        break;
      case 'contact':
        $scope.aboutSelected = false;
        $scope.contactSelected = true;
        break;
    }
  };
  $scope.initialUrl = $state.$current.url.source;
  $scope.checkUrl($scope.initialUrl.substring(6));

};
