//Application configuration
var TeamCollabApp = angular.module('TeamCollabApp', ['ngRoute']);

TeamCollabApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/project/:projectId', {
        templateUrl: 'main.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);