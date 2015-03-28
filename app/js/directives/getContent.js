angular.module('mudHowlers').directive('getContent', ['$firebase', '$window', function($firebase, $window){
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs){

        scope.end = 0;
        scope.start = 0;
        scope.isLoading = true;
        scope.canScroll = true;
        var postsRef = 'https://mudhowlers.firebaseio.com/posts/';
        scope.posts = [];

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

        /* DOM functions*/
        angular.element($window).bind("scroll", function() {
            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            var body = document.body, html = document.documentElement;
            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
              if(scope.start > 0 && scope.end > 0){
                scope.end -= 2;
                scope.start = scope.end - 1;
                scope.getData();
              }
              else if(scope.start == 0 && scope.end == 1){
                scope.$apply(function () {
                  scope.canScroll = false;
                });
              }
            }
        });

        /* scope functions*/
        scope.getTotal = function(){
          var total = $firebase(new Firebase('https://mudhowlers.firebaseio.com/postsCounter/')).$asObject();
          total.$loaded().then(function(totalObj){
            scope.end = totalObj.$value - 1;
            scope.start = scope.end - 1;
            scope.getData();
          });
        };

        scope.getData = function(){
          scope.postsArray = [];
          scope.posts = [];
          var childsRef;
          childsRef = new Firebase(postsRef).startAt(scope.start).endAt(scope.end).limitToFirst(2);//.limitToLast(2);
          scope.postsArray = $firebase(childsRef).$asArray();
          scope.postsArray.$loaded().then(function(arrayData){
            angular.forEach(arrayData, function(value, key) {
              if(value.section == attrs.getContent){
                scope.posts.push(value);
              }
              else{
                // do nothing

              }
            });
            scope.displayData();
          });
        };

        scope.displayData = function(){
          var index = 0;
          scope.isLoading = false;
          scope.posts.reverse();
          angular.forEach(scope.posts, function(value, key) {
            element.append("<div class='newPost'></div>")
            scope.surrogateObj = value;
            scope.element = angular.element(document.getElementsByClassName('newPost'));
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
          });
        };


        scope.getTotal();
      } /*end*/
    }
}]);
