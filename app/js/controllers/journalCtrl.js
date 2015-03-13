angular.module('mudHowlers').controller('journalCtrl', journalCtrl);

journalCtrl.$inject = ['$scope', '$state', '$firebase'];

function journalCtrl($scope, $state, $firebase){
  $scope.isLoading = true;
  var location = 'https://mudhowlers.firebaseio.com/Journal/posts/';
  var journalRef = new Firebase(location);
  $scope.posts = [];

  $scope.landscapeSizes = [
    {width: '940px', height: '628px'},
    {width: '627px', height: '420px'},
    {width: '470px', height: '315px'},
    {width: '314px', height: '210px'},
  ];

  $scope.textSizes = ['four columns', 'four columns offset-by-three'];
  $scope.videoSizes = ['nine columns', 'nine columns offset-by-two'];
  $scope.imagesSizes = ['six columns offset-by-one', 'five columns offset-by-one'];

  $scope.postsArray =  $firebase(journalRef).$asArray();
  var watchArray = $scope.$watchCollection('posts', function() {
    if($scope.posts.length != 0){
      $scope.isLoading = false;
      $scope.surrogateObj = $scope.posts[$scope.posts.length - 1];
      var target = document.getElementsByClassName('newPost');
      $scope.element = angular.element(target);
      //console.log($scope.surrogateObj);
      if($scope.surrogateObj.contentType == 'Texto'){
        $scope.element.addClass($scope.textSizes[Math.floor(Math.random() *$scope.textSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogateObj.title + "</p>");
        $scope.element.append("<p class='postText'>" + $scope.surrogateObj.content + "</p>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogateObj.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogateObj.dateDay + '/' + $scope.surrogateObj.dateMonth + '/' + $scope.surrogateObj.dateYear + "</p>");
      }
      if($scope.surrogateObj.contentType == 'Video'){
        $scope.element.addClass($scope.videoSizes[Math.floor(Math.random()*$scope.videoSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogateObj.title + "</p>");
        $scope.element.append("<iframe width='100%' height='315' src='" + $scope.surrogateObj.content + "'></iframe>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogateObj.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogateObj.dateDay + '/' + $scope.surrogateObj.dateMonth + '/' + $scope.surrogateObj.dateYear + "</p>");
      }
      if($scope.surrogateObj.contentType == 'Imagen'){
        var heriarchy = $scope.surrogateObj.heriarchy;
        switch($scope.surrogateObj.contentPresentation){
          case 'Landscape':
            $scope.element.addClass('post');
            $scope.element.css({
              'width': $scope.landscapeSizes[heriarchy-1].width,
              'height': $scope.landscapeSizes[heriarchy-1].height,
              'background-image': 'url(' + $scope.surrogateObj.content + ')',
              'background-position': 'center center',
              'background-size': 'cover',
              'z-index': '-1',
              'float': 'left',
            });
            break;
        }
        /*
        $scope.element.addClass($scope.imagesSizes[Math.floor(Math.random()*$scope.imagesSizes.length)]);
        $scope.element.addClass('post');
        $scope.element.append("<p class='postTitle'>" + $scope.surrogateObj.title + "</p>");
        $scope.element.append("<img class='postImage' src='" + $scope.surrogateObj.content + "'>");
        $scope.element.append("<p class='postAuthor'>" + $scope.surrogateObj.author + "</p>");
        $scope.element.append("<p class='postDate'>" + $scope.surrogateObj.dateDay + '/' + $scope.surrogateObj.dateMonth + '/' + $scope.surrogateObj.dateYear + "</p>");
        */
      }
      $scope.element.removeClass('newPost');
    }
  }, true);

  $scope.postsArray.$watch(function(child){
    $scope.childObj = $firebase(new Firebase(location + child.key)).$asObject();
    $scope.childObj.$loaded().then(function(data){
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
  //$scope.postsArray.$destroy();
};
