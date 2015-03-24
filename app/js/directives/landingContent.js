angular.module('mudHowlers').directive('landingContent', ['$firebase', '$window', function($firebase, $window){
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
        var firebaseRef = new Firebase(postsRef);
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
          scope.postsArray.startAt(scope.begin).limit(scope.end).on('child_added', function(child) {
            // code to handle childs
            scope.childObj = $firebase(new Firebase(postsRef + child.key())).$asObject();
            scope.childObj.$loaded().then(function(data){
              console.log(data);
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
            });
          });
        };


        var watchArray = scope.$watchCollection('posts', function() {
          if(scope.posts.length != 0){
            scope.isLoading = false;
            element.append("<div class='newPost'></div>")
            scope.surrogateObj = scope.posts[scope.posts.length - 1];
            scope.element = angular.element(document.getElementsByClassName('newPost'));
            /*
            if(scope.surrogateObj.contentType == 'Texto'){
              scope.element.addClass(scope.textSizes[Math.floor(Math.random() *scope.textSizes.length)]);
              scope.element.addClass('post');
              scope.element.append("<p class='postTitle'>" + scope.surrogateObj.title + "</p>");
              scope.element.append("<p class='postText'>" + scope.surrogateObj.content + "</p>");
              scope.element.append("<p class='postAuthor'>" + scope.surrogateObj.author + "</p>");
              scope.element.append("<p class='postDate'>" + scope.surrogateObj.dateDay + '/' + scope.surrogateObj.dateMonth + '/' + scope.surrogateObj.dateYear + "</p>");
            }
            */
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
            //if(scope.surrogateObj.contentType == 'Imagen'){
            else{
              var heriarchy = scope.surrogateObj.heriarchy;
              var type = scope.surrogateObj.contentType;
              scope.element.addClass('post');
              switch(scope.surrogateObj.contentPresentation){
                case 'Landscape':
                  //scope.element.addClass('post');
                  if(heriarchy == 1){
                    scope.element.addClass('sixteen columns');
                  }
                  if(heriarchy == 2){
                    scope.element.addClass('two-thirds column');
                  }
                  if(heriarchy == 3){
                    scope.element.addClass('eight columns');
                  }
                  if(heriarchy == 4){
                    scope.element.addClass('one-third column');
                  }
                  //scope.styleIt(heriarchy, type, scope.element);
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
                    scope.element.append("<p class='landscape-title-1'>" + scope.surrogateObj.title + "</p>");
                    scope.element.append("<p class='landscape-author-1'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                    scope.element.append("<p class='landscape-date-1'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  }
                  else if(type == 'Texto'){
                    scope.element.css({
                      'margin-bottom': '10px',
                      'height': scope.landscapeSizes[heriarchy-1].height,
                      'z-index': '-1',
                      'float': 'left',
                      'position': 'relative',
                    });
                    scope.element.append("<p class='landscape-title-2'>" + scope.surrogateObj.title + "</p>");
                    scope.element.append("<p class='landscape-author-2'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                    scope.element.append("<p class='landscape-date-2'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  }
                break;
                case 'Portrait':
                  //console.log(scope.surrogateObj);
                  //scope.element.addClass('post');
                  if(heriarchy == 1){
                    scope.element.addClass('two-thirds column');
                  }
                  if(heriarchy == 2){
                    scope.element.addClass('eight columns');
                  }
                  if(heriarchy == 3){
                    scope.element.addClass('one-third column');
                  }
                  scope.styleIt(heriarchy, type, scope.element);
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
                  scope.element.append("<p class='landscape-title-1'>" + scope.surrogateObj.title + "</p>");
                  scope.element.append("<p class='landscape-author-1'> <span>Posted by</span><br> " + scope.surrogateObj.author + "</p>");
                  scope.element.append("<p class='landscape-date-1'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  break;
                case 'Social':
                  //scope.element.addClass('post');
                  if(heriarchy == 1){
                    scope.element.addClass('two-thirds column');
                  }
                  if(heriarchy == 2){
                    scope.element.addClass('eight columns');
                  }
                  if(heriarchy == 3){
                    scope.element.addClass('one-third column');
                  }
                  if(heriarchy == 4){
                    scope.element.addClass('four columns');
                  }
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
                    if(heriarchy == 4){
                      scope.element.append("<p class='landscape-title-1' style='width: 210px !important;'>" + scope.surrogateObj.title + "</p>");
                    }
                    else{
                      scope.element.append("<p class='landscape-title-1'>" + scope.surrogateObj.title + "</p>");
                    }
                    //scope.element.append("<p class='landscape-title-1'>" + scope.surrogateObj.title + "</p>");
                    scope.element.append("<p class='landscape-author-1'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                    scope.element.append("<p class='landscape-date-1'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  }
                  else if(type == 'Texto'){
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
                    if(heriarchy == 4){
                      scope.element.append("<p class='landscape-title-2' style='width: 210px !important;'>" + scope.surrogateObj.title + "</p>");
                    }
                    else{
                      scope.element.append("<p class='landscape-title-2'>" + scope.surrogateObj.title + "</p>");
                    }
                    scope.element.append("<p class='social-content-2'>" + scope.surrogateObj.content + "</p>");
                    //scope.element.append("<p class='landscape-title-2'>" + scope.surrogateObj.title + "</p>");
                    scope.element.append("<p class='landscape-author-2'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                    scope.element.append("<p class='landscape-date-2'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  }
                  /*
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
                  */
                  /*
                  if(heriarchy == 4){
                    scope.element.append("<p class='landscape-title-1' style='width: 210px !important;'>" + scope.surrogateObj.title + "</p>");
                  }
                  else{
                    scope.element.append("<p class='landscape-title-1'>" + scope.surrogateObj.title + "</p>");
                  }
                  scope.element.append("<div class='hoverBlock'></div>");
                  scope.element.append("<p class='landscape-author-1'> <span>Posted by</span><br>" + scope.surrogateObj.author + "</p>");
                  scope.element.append("<p class='landscape-date-1'> <span>Date</span><br> " + scope.surrogateObj.dateDay + '.' + scope.surrogateObj.dateMonth + '.' + scope.surrogateObj.dateYear + "</p>");
                  */
                  break;
              }
            }
            scope.element.removeClass('newPost');
          }
        }, true);

        scope.styleIt = function(heriarchy, type, element){
          console.log(type);
          console.log(heriarchy);
          console.log(element);

        };


        scope.getData();
      } /*end*/
    }
}]);
