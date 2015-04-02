angular.module('mudHowlers').directive('landingContent', ['$firebase', '$window', '$state', '$timeout', function($firebase, $window, $state, $timeout){
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs){

        scope.startValue = 0;
        scope.startPoint = 0;
        scope.end = 0;
        scope.limit = 4;
        scope.isLoading = true;
        scope.buttonDisabled = true;
        scope.lastOneIn = false;

        scope.start = 0;
        var postsRef = 'https://mudhowlers.firebaseio.com/posts/';
        scope.posts = [];
        scope.postsArray =  [];
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


        /* scope functions */
        scope.getTotal = function(){
          var total = $firebase(new Firebase('https://mudhowlers.firebaseio.com/postsCounter/')).$asObject();
          total.$loaded().then(function(totalObj){
            scope.end = totalObj.$value - 1;
            scope.startValue = scope.end - (scope.limit-1);
            scope.totalPosts = totalObj.$value;
            scope.getData();
          });
        };

        scope.animatePosts = function(){
          if(element[0].children[0] !== undefined){
            element.append('&nbsp;');
            element.append('<p>&nbsp;</p>');
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
          if(scope.startValue >= -2){
            scope.postsArray = [];
            scope.posts = [];
            var childrensRef, childObj;
            childrensRef = new Firebase(postsRef).orderByPriority().startAt(scope.startValue).limitToFirst(scope.limit);//.limitToLast(2);
            scope.postsArray = $firebase(childrensRef).$asArray();
            scope.postsArray.$loaded().then(function(arrayData){
              angular.forEach(arrayData, function(arrayObj, key) {
                console.log(arrayObj)
                if(arrayObj.status === true){
                  if(arrayObj.$priority === 0){
                    console.log('last one');
                    scope.lastOneIn = true;
                  }
                  scope.posts.push(arrayObj);
                }
                else{
                  // do nothing
                }
                /*
                if(arrayObj.status === true){
                  if(arrayObj.$priority === 0){
                    console.log('last one');
                    scope.lastOneIn = true;
                  }
                  childObj = $firebase(new Firebase(postsRef + arrayObj.$id)).$asObject();
                  childObj.$loaded().then(function(childData){
                    if(childData.status === true){
                      scope.posts.push(childData);
                    }
                    else{
                      // do nothing
                    }
                  });
                }
                else{
                    // do nothing
                }
                */
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
          /*
          scope.postsArray = [];
          scope.posts = [];
          var childsRef;
          childsRef = new Firebase(postsRef).startAt(scope.start).endAt(scope.end).limitToFirst(2);//.limitToLast(2);
          scope.postsArray = $firebase(childsRef).$asArray();
          scope.postsArray.$loaded().then(function(arrayData){
            angular.forEach(arrayData, function(value, key) {
              if(value.status){
                scope.posts.push(value);
              }
              else{
                // do nothing
              }
            });
          });
          if(scope.postsArray[0] != undefined){
            scope.postsArray.$destroy();
          }
          */
        };

        scope.$watch('posts', function () {
          if(scope.posts.length === scope.limit){
            angular.forEach(scope.posts, function(value, key) {
              scope.displayData();
            });
            scope.animatePosts();
          }
          else{
            // do nothing
          }
        }, true);


        scope.displayData = function(){
          var index = 0;
          scope.isLoading = false;
          scope.posts.reverse();
          if(scope.lastOneIn === true){
            scope.posts.pop();
            scope.posts.pop();
          }
          angular.forEach(scope.posts, function(value, key) {
            element.append("<div class='newPost'></div>")
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
          });

        };

        scope.getTotal();
      } /*end*/
    }
}]);
