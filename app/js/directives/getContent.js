angular.module('mudHowlers').directive('getContent', ['$firebase', '$window', function($firebase, $window){
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs){
        angular.element($window).bind("scroll", function() {
            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            var body = document.body, html = document.documentElement;
            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                scope.begin+=11;
                scope.end+=11;
                scope.getData();
            }
        });
        scope.begin = 0;
        scope.end = 10;
        scope.isLoading = true;
        var postsRef = 'https://mudhowlers.firebaseio.com/posts/';
        var location = 'https://mudhowlers.firebaseio.com/' + attrs.getContent + '/posts/';
        var firebaseRef = new Firebase(location);
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

        scope.textSizes = ['four columns', 'four columns offset-by-three'];

        scope.postsArray =  firebaseRef;
        scope.getData = function(){

          scope.postsArray.startAt(scope.begin).limit(scope.end).on('child_added', function(child){
            if(child.val()){
              if(child.key() == 1 && child.val()){ // exception that handles the child with id = 0
                scope.childObj = $firebase(new Firebase(postsRef + '0')).$asObject();
                scope.childObj.$loaded().then(function(data){
                  if(data.status == true){
                    if(data.contentType == 'Texto'){
                      scope.posts.push(data);
                    }
                    if(data.contentType == 'Video'){
                      scope.posts.push(data);
                    }
                    if(data.contentType == 'Imagen'){
                      scope.posts.push(data);
                    }
                    else{
                      // do nothing
                    }
                  }
                });
              }
              scope.childObj = $firebase(new Firebase(postsRef + child.key())).$asObject();
              scope.childObj.$loaded().then(function(data){
                if(data.status == true){
                  if(data.contentType == 'Texto'){
                    scope.posts.push(data);
                  }
                  if(data.contentType == 'Video'){
                    scope.posts.push(data);
                  }
                  if(data.contentType == 'Imagen'){
                    scope.posts.push(data);
                  }
                  else{
                    // do nothing
                  }
                }
              });
            }
            else{
              // if false, object has been deleted
            }
          });
        };


        var watchArray = scope.$watchCollection('posts', function() {
          if(scope.posts.length != 0){
            scope.isLoading = false;
            element.append("<div class='newPost'></div>")
            scope.surrogateObj = scope.posts[scope.posts.length - 1];
            scope.element = angular.element(document.getElementsByClassName('newPost'));
            if(scope.surrogateObj.contentType == 'Video'){
              scope.element.addClass('post');
              scope.element.addClass('sixteen columns');
              scope.element.css({
                'margin-bottom': '10px',
                'height': '552px',
                'float': 'left',
              });
              scope.element.append("<iframe width='100%' height='100%' src='" + scope.surrogateObj.content + "'></iframe>");
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
          }
        }, true);

        scope.getData();
      } /*end*/
    }
}]);
