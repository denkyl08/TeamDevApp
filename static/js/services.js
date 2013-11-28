TeamCollabApp.factory('projectListService', function() {
	return {
		getList : function() {
			return fakeProjectListData;
		}
	}
});

TeamCollabApp.factory('projectService', function() {
	return {
		getProject : function(projectId) {
			var thisLayer = fakeProjectListData;
			while (true) {
				var nextLayer = [];
				for (var i = 0; i < thisLayer.length; i++) {
					if (thisLayer[i].properties.id == projectId) {
						return thisLayer[i];
					}
					if (thisLayer[i].children.length > 0) {
						nextLayer = nextLayer.concat(thisLayer[i].children);
					}
				}
				if (nextLayer.length <= 0) {
					break;
				}
				thisLayer = nextLayer;
			}
		}
	}
});

var fakeProjectListData = [
		{
			properties : {
				title: "Bug list", 
				id: "1"
			},		
			children : [
				{
					properties : {
						title: "Bug one", 
						id: "2"
					},		
					children : [
					]
				},
				{
					properties : {
						title: "Bug two", 
						id: "3"
					},		
					children : [
					]
				}
			]
		}
	];