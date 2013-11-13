//Controllers
var globalVars = {};

TeamCollabApp.controller('UserCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      // Let's namespace the user details
    // Also great for DOM visual aids too
    $scope.user = {};
    $scope.user.details = {
      "username": "Kyle Dennison",
      "id": "89101112"
    };
    globalVars.user = $scope.user.details;
    $scope.currentProjects = [];
}]);

TeamCollabApp.controller('ProjectNavCtrl', ['$scope', '$rootScope', function ($scope, $rootScope){
	$scope.projects = [
		{
			properties : {
				title: "projectName1", 
				id: "projectId"
			},		
			children : [
			]
		}
	];

	$scope.delete = function(project) {
        project.children = [];
    };

    $scope.deleteNode = function(project) {
    	delete project;
    };

    $scope.add = function(project) {
        var newName = project.properties.title;
        project.children.push({
        	properties : {
        		title: newName
        	},
        	children: []
        });
    };

    $scope.addToRoot = function() {
    	var newName = "new";
    	$scope.projects.push({
    		properties : {
        		title: newName
        	},
        	children: []
    	});
    }

	$scope.setProject = function(project) {
		$rootScope.$broadcast('SET_PROJECT', project);
	}
}]);

TeamCollabApp.controller('ProjectCtrl', ['$scope', '$location', '$anchorScroll', '$compile', '$rootScope', function ($scope, $rootScope, $location, $anchorScroll, $compile) {
	$scope.properties = {
		title : "titleval",
		id : "idval"
	}
    $scope.chatLog = [];
    	

    $scope.submitChatPost = function() {
    	if ($scope.Post.length == 0) {
    		return;
    	}
    	if (!$scope.chatLog) {
    		$scope.chatLog = [];
    	}
    	var chatPost = {
    		user : globalVars.user,
    		username : globalVars.user.username,
    		id: String($scope.chatLog.length+1),
    		text : $scope.Post
    	}

    	$scope.chatLog.push(chatPost);
	    setTimeout(function() {
	    	console.log($('#'+String($scope.chatLog.length))[0].scrollIntoView(true));
	    }, 100)

	    $scope.Post = '';
	    return;
    };

    $scope.$on('SET_PROJECT', function ( event, project ) { 
    	$scope.properties = project.properties;
    	$scope.chatLog = project.chatLog;
    	$scope.custom = {
    		variable: "value"
    	}
    });
    

}]);