angular.module('mudHowlers').controller('journalCtrl', journalCtrl);

journalCtrl.$inject = ['$scope', '$state', '$firebase'];

function journalCtrl($scope, $state, $firebase){
  $scope.isLoading = true;
  var location = 'https://howlers-cms.firebaseio.com/Journal/';
  var journalRef = new Firebase('https://howlers-cms.firebaseio.com/Journal');
  $scope.posts = [];

  $scope.textSizes = ['four columns', 'four columns offset-by-three'];
  $scope.videoSizes = ['nine columns', 'nine columns offset-by-two'];
  $scope.imagesSizes = ['six columns offset-by-one', 'five columns offset-by-one'];

  $scope.journalArray =  $firebase(journalRef).$asArray();

  var watchArray = $scope.$watchCollection('posts', function() {
    if($scope.posts.length != 0){
      $scope.isLoading = false;
      $scope.surrogate = $scope.posts[$scope.posts.length - 1];
      var target = document.getElementsByClassName('newPost');
      $scope.element = angular.element(target);
      console.log($scope.surrogate);
      if($scope.surrogate.contentType == 'Texto'){
        $scope.element.addClass($scope.textSizes[Math.floor(Math.random() *$scope.textSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogate.title + "</p>");
        $scope.element.append("<p class='postText'>" + $scope.surrogate.content + "</p>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogate.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogate.dateDay + '/' + $scope.surrogate.dateMonth + '/' + $scope.surrogate.dateYear + "</p>");
      }
      if($scope.surrogate.contentType == 'Video'){
        $scope.element.addClass($scope.videoSizes[Math.floor(Math.random()*$scope.videoSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogate.title + "</p>");
        $scope.element.append("<iframe width='100%' height='315' src='" + $scope.surrogate.content + "'></iframe>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogate.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogate.dateDay + '/' + $scope.surrogate.dateMonth + '/' + $scope.surrogate.dateYear + "</p>");
      }
      if($scope.surrogate.contentType == 'Imagen'){
        $scope.element.addClass($scope.imagesSizes[Math.floor(Math.random()*$scope.imagesSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogate.title + "</p>");
        $scope.element.append("<img class='postImage' src='" + $scope.surrogate.content + "'>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogate.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogate.dateDay + '/' + $scope.surrogate.dateMonth + '/' + $scope.surrogate.dateYear + "</p>");
      }
      $scope.element.removeClass('newPost');
    }
  }, true);

  $scope.journalArray.$watch(function(child){
    $scope.childObj = $firebase(new Firebase(location + child.key)).$asObject();
    $scope.childObj.$loaded().then(function(data){
      // /console.log(data);
      if(data.contentType == 'Texto'){
        $scope.posts.push(data);
      }
      if(data.contentType == 'Video'){
        $scope.posts.push(data);
      }
      if(data.contentType == 'Imagen'){
        $scope.posts.push(data);
      }
      else{
        // do nothing
      }
    });
  });

};
