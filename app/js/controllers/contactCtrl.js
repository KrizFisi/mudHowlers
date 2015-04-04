angular.module('mudHowlers').controller('contactCtrl', contactCtrl);

contactCtrl.$inject = ['$scope', '$firebase'];

function contactCtrl ($scope, $firebase){
  var ref = new Firebase('https://mudhowlers.firebaseio.com/contacts');
  $scope.contacts = $firebase(ref).$asArray();
};
