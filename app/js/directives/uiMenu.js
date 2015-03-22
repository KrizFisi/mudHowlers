angular.module('mudHowlers').directive('uiMenu', function($window, $document){
  return {
    restrict: 'A', // detects an classname
    scope: {}, // parent scope
    link: function(scope, element, attrs){
      element.append("<img src='img/menuIcon.svg' class='menuIcon' ng-click='showMenu()'>");
      scope.elements = angular.element(document.getElementsByClassName('menuLink'));
      scope.elements.css({'display': 'none'});
      scope.showMenu = function(){
        console.log(1);
      };
    }
  } /*end*/
});
