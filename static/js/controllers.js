//Controllers

TeamCollabApp.controller('UserCtrl', ['$scope', '$rootScope', 'User', function ($scope, $rootScope, User) {
    User.setUser("89101112", "Kyle Dennison");
    $scope.currentProjects = [];
}]);

TeamCollabApp.controller('ProjectNavCtrl', ['$scope', '$rootScope', 'projectListService', function ($scope, $rootScope, projectListService){
	$scope.projects = projectListService.getList();


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

    $scope.contextMenu = function(project, event) {
        $scope.contextProj = project; // set global contextProj to the one just clicked
        $("#contextMenu")
        .css({
          display: "block",
          left: event.pageX,
          top: event.pageY-($("body").css('padding-top')).replace('px', '') 
        });
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

TeamCollabApp.controller('ProjectCtrl', [ '$scope', '$location', 'projectService', '$anchorScroll', '$compile', '$rootScope', '$routeParams', '$route', 'User', function ($scope, $rootScope, projectService, $location, $anchorScroll, $compile, $routeParams, $route, User) {
	$scope.properties = {
		title : "titleval",
		id : "idval"
	}
    $scope.chatLog = [];

    $scope.plugins = [
        {title: "Chat", isActive:true},
        {title: "Properties", isActive:false}
    ]
    	
    $scope.projectId = $routeParams.projectId;

    $scope.$on(
        "$routeChangeSuccess",
        function( $currentRoute, $previousRoute ){
            $scope.projectId = $routeParams.projectId;
            var project = projectService.getProject($routeParams.projectId);
            if (project == undefined) {
                return;
            }
            if (project.chatLog != undefined) {$scope.chatLog = project.chatLog;}
            else {$scope.chatLog = [];}
            if (project.plugins != undefined) {$scope.plugins = project.plugins;}
            else {$scope.plugins = [
                {title: "Chat", isActive:true},
                {title: "Properties", isActive:false}
            ];}
            if (project.properties != undefined) {$scope.properties = project.properties;}
            else {$scope.properties = {};}
            if (project.custom != undefined) {$scope.custom = project.custom;}
            else {$scope.custom = {};}
        }
    );

    $scope.submitChatPost = function() {
    	if ($scope.Post.length == 0) {
    		return;
    	}
    	if (!$scope.chatLog) {
    		$scope.chatLog = [];
    	}
    	var thisUser = User.getUser();
    	var chatPost = {
    		user : thisUser,
    		username : thisUser.username,
    		id: String($scope.chatLog.length+1),
    		text : $scope.Post
    	}

    	$scope.chatLog.push(chatPost);
	    setTimeout(function() {
	    	console.log($('#'+String($scope.chatLog.length))[0].scrollIntoView(true));
	    }, 100)

	    console.log($scope.properties.id);
        var project = projectService.getProject($scope.properties.id);
        if (project.chatLog == undefined) {project.chatLog = [];}
        project.chatLog.push(chatPost);
	    $scope.Post = '';
        return;
    };

    $scope.pluginActive = function(plugin) {
        if (plugin.isActive) {
            return "active"
        }
        return ""
    }

    $scope.setPlugin = function(plugin) {
        angular.forEach($scope.plugins, function(plugin, i) {
            plugin.isActive = false
        });
        plugin.isActive = true;
    }

    $scope.$on('SET_PROJECT', function ( event, project ) { 
    	$scope.properties = project.properties;
    	$scope.chatLog = project.chatLog;
    	$scope.custom = {
    		variable: "value"
    	}
    });
    

}]);
