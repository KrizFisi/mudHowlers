angular.module('mudHowlers').controller('aboutCtrl', aboutCtrl);

aboutCtrl.$inject = ['$scope', '$state', '$firebase'];

function aboutCtrl ($scope, $state, $firebase){
  var ref = new Firebase('https://mudhowlers.firebaseio.com/aboutText/');
  $scope.textObj = $firebase(ref).$asObject();
  $scope.textObj.$bindTo($scope, "data").then(function(){
    $scope.aboutText = $scope.data.$value;
  });
};
