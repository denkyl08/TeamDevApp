// Directives

TeamCollabApp.directive('postBox', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<form ng-submit="submitChatPost()" class="fill col-md-12">'+
        		'<textarea ng-model="Post" class="col-md-10 fill" rows="2">'+
               	'{{Post}}</textarea>'+
        		'<input class="btn-primary col-md-2 fill" type="submit">'+
      		  '</form>',

  };
});

TeamCollabApp.directive('jsonProperty', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<form ng-submit="editorEnabled=!editorEnabled"><span ng-hide="editorEnabled">'+
    			'<a ng-click="addProjectProperty($event); editorEnabled=!editorEnabled">edit</a>'+
    		  '</span>'+
    		  '<span ng-show="editorEnabled">'+
    		  	'<input>'+
    		  '</span></form>',
  };
});

TeamCollabApp.directive('clickAnywhereButHere', function($document){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        // this part keeps it from firing the click on the document.
        e.stopPropagation();
      });
      $document.bind('click', function() {
        // magic here.
        scope.$apply(attr.clickAnywhereButHere);
      })
    }
  }
})

TeamCollabApp.directive('json', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        // Beware: trim() is not available in old browsers
        if (!text || text.trim() === '')
        	//console.log('aaaaaahhh');
          return {}
        else
          // TODO catch SyntaxError, and set validation error..
      	  try {
      	  	angular.fromJson(text);
      	  	scope.goodPrj = "white";
      	  } catch(err) {
      	  	console.log(err.toString());
      	  	console.log(err.lineNumber);
      	  	scope.goodPrj = "#FFC1C1";
      	  }
      	  return angular.fromJson(text);
      }

      function toUser(object) {
          // better than JSON.stringify(), because it formats + filters $$hashKey etc.
          return angular.toJson(object, true);
      }
      
      // push() if faster than unshift(), and avail. in IE8 and earlier (unshift isn't)
      ngModelCtrl.$parsers.push(fromUser);
      ngModelCtrl.$formatters.push(toUser);
      
      // $watch(attrs.ngModel) wouldn't work if this directive created a new scope;
      // see http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope how to do it then
      scope.$watch(attrs.ngModel, function(newValue, oldValue) {
        if (newValue != oldValue) {
          ngModelCtrl.$setViewValue(toUser(newValue));
          // TODO avoid this causing the focus of the input to be lost..
          ngModelCtrl.$render();
        }
      }, true); // MUST use objectEquality (true) here, for some reason..
    }
  };  
});

TeamCollabApp.directive('ngRightClick', function($parse) {
    return function($scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            $scope.$apply(function() {
                event.preventDefault();
                $scope.event = event;
                fn($scope, event);
            });
        });
    };
});