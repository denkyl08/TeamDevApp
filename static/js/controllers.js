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
			],
            collapsed : true
		}
	];


    $scope.contextProj = '';
    
    $scope.projectContainsChildren = function(project) {
        return project.children.length > 0;
    }

    $scope.deleteProj = function(project) {
        if (project.parent != undefined) {
            for (var i= 0; i < project.parent.children.length; i ++) {
                if (project.parent.children[i].properties.id == project.properties.id) {
                    project.parent.children.splice(i, 1);
                }
            }
        }
    };

    $scope.addProj = function(project) {
        console.log("in addProj");
        project.collapsed = false;
        project.children.push({
        	properties : {
        		title: "new"
        	},
        	children: [],
            parent: project,
            collapsed: true
        });
        
    };

    $scope.addRootProj = function() {
        $scope.projects.push({
            properties : {
                title: "new"
            },
            children: [],
            collapsed: true
        }); 
    }

    $scope.processContextMenu = function(index) {
        if (index >= 0) {
            $scope.contextMenuItems[index].action($scope.contextProj);
        }
        $("#contextMenu")
        .css({
          display: "none"
        });
    }

    $scope.contextMenu = function(project) {
        $scope.contextProj = project; // set global contextProj to the one just clicked
        console.log(event.pageY);
        console.log(($("body").css('padding-top')).replace('px', ''));
        $("#contextMenu")
        .css({
          display: "block",
          left: event.pageX,
          top: event.pageY-($("body").css('padding-top')).replace('px', '') 
        });
        console.log($scope.contextProj);
    }

	$scope.setProject = function(project) {
		$rootScope.$broadcast('SET_PROJECT', project);
	}

    $scope.expand = function(project) {
        project.collapsed = false;
    }

    $scope.collapse = function(project) {
        project.collapsed = true;
        for(var i; i < project.children.length; i ++) {
            project.children[i].collapsed = true;
        }
    }

    $scope.contextMenuItems = [
        {name:'Add Child', action: $scope.addProj },
        {name:'Delete', action: $scope.deleteProj }
    ]
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