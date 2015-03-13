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


        console.log(element);
        //element.append("<div id='inHere'></div>");
        //var target = document.getElementById('InHere');
        //scope.inHere = angular.element(target);
        scope.items = [1,2,3,4,5,6,7];
        //scope.inHere.attr("ng-repeat", "item in items track by $index");
        /*scope.items.forEach(function(value, key) {
          console.log(value);
          /*
            var newElement = angular.element(
                template.replace(/#OBJ#/g, attrs.items + '[' + key + ']')
            );
            $compile(newElement)(scope);
            elem.append(newElement);
            */
        //});

        scope.isLoading = true;





        var location = 'https://mudhowlers.firebaseio.com/Journal/posts/';
        var journalRef = new Firebase(location);
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
        scope.videoSizes = ['nine columns', 'nine columns offset-by-two'];
        scope.imagesSizes = ['six columns offset-by-one', 'five columns offset-by-one'];

        scope.postsArray =  journalRef;


        var watchArray = scope.$watchCollection('posts', function() {
          if(scope.posts.length != 0){
            scope.isLoading = false;
            element.append("<div class='newPost'></div>")
            scope.surrogateObj = scope.posts[scope.posts.length - 1];
            var target = document.getElementsByClassName('newPost');
            scope.element = angular.element(target);
            console.log(scope.surrogateObj);
            if(scope.surrogateObj.contentType == 'Texto'){
              scope.element.addClass(scope.textSizes[Math.floor(Math.random() *scope.textSizes.length)]);
              scope.element.addClass('post');
              scope.element.append("<p class='postTitle'>" + scope.surrogateObj.title + "</p>");
              scope.element.append("<p class='postText'>" + scope.surrogateObj.content + "</p>");
              scope.element.append("<p class='postAuthor'>" + scope.surrogateObj.author + "</p>");
              scope.element.append("<p class='postDate'>" + scope.surrogateObj.dateDay + '/' + scope.surrogateObj.dateMonth + '/' + scope.surrogateObj.dateYear + "</p>");
            }
            if(scope.surrogateObj.contentType == 'Video'){
              scope.element.addClass('post');
              scope.element.addClass('sixteen columns');
              scope.element.css({
                'margin-bottom': '10px',
                'height': '552px',
                'float': 'left',
              });
              //scope.element.append("<p class='postTitle'>" + scope.surrogateObj.title + "</p>");
              scope.element.append("<iframe width='100%' height='100%' src='" + scope.surrogateObj.content + "'></iframe>");
              //scope.element.append("<p class='postAuthor'>" + scope.surrogateObj.author + "</p>");
              //scope.element.append("<p class='postDate'>" + scope.surrogateObj.dateDay + '/' + scope.surrogateObj.dateMonth + '/' + scope.surrogateObj.dateYear + "</p>");
            }
            if(scope.surrogateObj.contentType == 'Imagen'){
              var heriarchy = scope.surrogateObj.heriarchy;
              switch(scope.surrogateObj.contentPresentation){
                case 'Landscape':
                  //console.log(scope.surrogateObj);
                  scope.element.addClass('post');
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
                  scope.element.css({
                    'margin-bottom': '10px',
                    'height': scope.landscapeSizes[heriarchy-1].height,
                    'background-image': 'url(' + scope.surrogateObj.content + ')',
                    'background-position': 'center center',
                    'background-size': 'cover',
                    'z-index': '-1',
                    'float': 'left',
                  });
                  break;
                case 'Portrait':
                  //console.log(scope.surrogateObj);
                  scope.element.addClass('post');
                  if(heriarchy == 1){
                    scope.element.addClass('two-thirds column');
                  }
                  if(heriarchy == 2){
                    scope.element.addClass('eight columns');
                  }
                  if(heriarchy == 3){
                    scope.element.addClass('one-third column');
                  }
                  scope.element.css({
                    'margin-bottom': '10px',
                    'height': scope.portraitSizes[heriarchy-1].height,
                    'background-image': 'url(' + scope.surrogateObj.content + ')',
                    'background-position': 'center center',
                    'background-size': 'cover',
                    'z-index': '-1',
                    'float': 'left',
                  });
                  break;
                case 'Social':
                  //console.log(scope.surrogateObj);
                  scope.element.addClass('post');
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
                  scope.element.css({
                    'margin-bottom': '10px',
                    'height': scope.socialSizes[heriarchy-1].height,
                    'background-image': 'url(' + scope.surrogateObj.content + ')',
                    'background-position': 'center center',
                    'background-size': 'cover',
                    'z-index': '-1',
                    'float': 'left',
                  });
                  break;
              }
            }
            scope.element.removeClass('newPost');
          }
        }, true);

        scope.getData = function(){
          scope.postsArray.startAt(scope.begin).limit(scope.end).on('child_added', function(child){
            console.log(child.key());
            scope.childObj = $firebase(new Firebase(location + child.key())).$asObject();
            scope.childObj.$loaded().then(function(data){
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
        scope.getData();

        /*
        scope.postsArray.$watch(function(child){
          scope.childObj = $firebase(new Firebase(location + child.key)).$asObject();
          scope.childObj.$loaded().then(function(data){
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
        */
      } /*end*/
    }
}]);
