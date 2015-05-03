angular.module('mudHowlers').directive('getContent', ['$firebase', '$window', '$state', '$timeout', function($firebase, $window, $state, $timeout){
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs){

        scope.totalPosts = 0;
        scope.startValue = 0;
        scope.end = 0;
        scope.limit = 1;

        scope.isLoading = true;
        scope.buttonDisabled = true;
        scope.lastOneIn = false;



        var postsRef = 'https://mudhowlers.firebaseio.com/posts/';
        var sectionRef = 'https://mudhowlers.firebaseio.com/' + attrs.getContent + '/posts/';
        scope.posts = [];
        scope.postsArray = [];
        scope.landscapeSizes = [
          {height: '618px'},
          {height: '410px'},
          {height: '305px'},
          {height: '200px'},
        ];
        scope.portraitSizes = [
          {height: '931px'},
          {height: '696px'},
          {height: '460px'},
        ];
        scope.socialSizes = [
          {height: '615px'},
          {height: '460px'},
          {height: '302px'},
          {height: '226px'},
        ];

        /* scope functions*/
        scope.getTotal = function(){
          var total = $firebase(new Firebase('https://mudhowlers.firebaseio.com/'+ attrs.getContent +'/priorityCounter/')).$asObject();
          total.$loaded().then(function(totalObj){
            scope.totalPosts = totalObj.$value;
            for(var i = 3; i <= scope.totalPosts; i++){
              if(scope.totalPosts%i === 0){
                scope.limit = i;
                i = scope.totalPosts+1;
              }
            }
            scope.end = totalObj.$value - 1;
            scope.startValue = scope.end - (scope.limit-1);
            scope.getData();
          });
        };

        scope.animatePosts = function(){
          if(element[0].children[0] !== undefined){
            var targets = angular.element(document.getElementsByClassName('entering'));
            $timeout(function(){
              targets.removeClass('entering');
              targets.addClass('arrived');
            }, 100);
          }
          else{
            // no childs
          }
        };

        scope.getData = function(){
          if(scope.lastOneIn === false){
            scope.postsArray = [];
            scope.posts = [];
            var childrensRef, childObj;
            childrensRef = new Firebase(sectionRef).orderByPriority().startAt(scope.startValue).limitToFirst(scope.limit);//.limitToLast(2);
            scope.postsArray = $firebase(childrensRef).$asArray();
            scope.postsArray.$loaded().then(function(arrayData){
              angular.forEach(arrayData, function(arrayObj, key) {
                if(arrayObj.$priority === 0){
                  scope.lastOneIn = true;
                }
                childObj = $firebase(new Firebase(postsRef + arrayObj.$id)).$asObject();
                childObj.$loaded().then(function(childData){
                  scope.posts.push(childData);
                  scope.checkIfReachedLimit();
                });
              });
            });
            if(scope.postsArray[0] != undefined){
              scope.postsArray.$destroy();
            }
            scope.startValue -= scope.limit;

          }
          else{
            scope.buttonDisabled = false;
          }
        };

        scope.checkIfReachedLimit = function(){
          if(scope.posts.length >= scope.limit){
            angular.forEach(scope.posts, function(value, key) {
              scope.displayData();
            });
            scope.animatePosts();
          }
          else{
            // do nothing
          }
        };
        /*
        scope.$watch('posts', function () {
          if(scope.posts.length >= scope.limit){
            angular.forEach(scope.posts, function(value, key) {
              scope.displayData();
            });
            scope.animatePosts();
          }
          else{
            // do nothing
          }
        }, true);
        */

        scope.displayData = function(){
          var index = 0;
          scope.isLoading = false;
          scope.posts.reverse();
          angular.forEach(scope.posts, function(value, key) {
            if(value.status === true){
              element.append("<div class='newPost'></div>");
              scope.surrogateObj = value;
              scope.element = angular.element(document.getElementsByClassName('newPost'));
              scope.element.addClass('entering');
              scope.element.addClass('canTransform');
              if(scope.surrogateObj.contentType == 'Video'){
                scope.element.addClass('post');
                scope.element.addClass('sixteen columns');
                scope.element.css({
                  'margin-bottom': '10px',
                  'height': '552px',
                  'float': 'left',
                });
                scope.element.append("<iframe width='100%' height='100%' src='http://www.youtube.com/embed/" + scope.surrogateObj.content + "'></iframe>");
              }
              else{
                var heriarchy = scope.surrogateObj.heriarchy;
                var type = scope.surrogateObj.contentType;
                scope.element.addClass('post');
                switch(scope.surrogateObj.contentPresentation){
                  case 'Landscape':
                    if(heriarchy == 1)
                      scope.element.addClass('sixteen columns');
                    if(heriarchy == 2)
                      scope.element.addClass('two-thirds column');
                    if(heriarchy == 3)
                      scope.element.addClass('eight columns');
                    if(heriarchy == 4)
                      scope.element.addClass('one-third column');
                    if(type == 'Imagen'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.landscapeSizes[heriarchy-1].height,
                        'background-image': 'url(' + scope.surrogateObj.content + ')',
                        'background-position': 'center center',
                        'background-size': 'cover',
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<div class='hoverBlock'></div>");
                      scope.element.append("<h1 class='image-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='image-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='image-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                    else if(type == 'Texto'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.landscapeSizes[heriarchy-1].height,
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<h1 class='post-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='post-content'>" + scope.surrogateObj.content + "</p>");
                      scope.element.append("<p class='post-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='post-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                  break;
                  case 'Portrait':
                    if(heriarchy == 1)
                      scope.element.addClass('two-thirds column');
                    if(heriarchy == 2)
                      scope.element.addClass('eight columns');
                    if(heriarchy == 3)
                      scope.element.addClass('one-third column');
                    if(type == 'Imagen'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.portraitSizes[heriarchy-1].height,
                        'background-image': 'url(' + scope.surrogateObj.content + ')',
                        'background-position': 'center center',
                        'background-size': 'cover',
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<div class='hoverBlock'></div>");
                      scope.element.append("<h1 class='image-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='image-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='image-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                    else if(type == 'Texto'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.portraitSizes[heriarchy-1].height,
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<h1 class='post-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='post-content'>" + scope.surrogateObj.content + "</p>");
                      scope.element.append("<p class='post-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='post-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                    break;
                  case 'Social':
                    if(heriarchy == 1)
                      scope.element.addClass('two-thirds column');
                    if(heriarchy == 2)
                      scope.element.addClass('eight columns');
                    if(heriarchy == 3)
                      scope.element.addClass('one-third column');
                    if(heriarchy == 4)
                      scope.element.addClass('four columns');
                    if(type == 'Imagen'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.socialSizes[heriarchy-1].height,
                        'background-image': 'url(' + scope.surrogateObj.content + ')',
                        'background-position': 'center center',
                        'background-size': 'cover',
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<div class='hoverBlock'></div>");
                      scope.element.append("<h1 class='image-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='image-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='image-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                    else if(type == 'Texto'){
                      scope.element.css({
                        'margin-bottom': '10px',
                        'height': scope.socialSizes[heriarchy-1].height,
                        'z-index': '-1',
                        'float': 'left',
                        'position': 'relative',
                      });
                      scope.element.append("<h1 class='post-title'>" + scope.surrogateObj.title + "</h1>");
                      scope.element.append("<p class='post-content'>" + scope.surrogateObj.content + "</p>");
                      scope.element.append("<p class='post-author'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                      scope.element.append("<p class='post-date'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                    }
                    break;
                }
              }
              scope.element.removeClass('newPost');
              scope.posts = [];
            }
            else{
              // do not show
            }
          });
        };

        scope.getTotal();
      } /*end*/
    }
}]);
