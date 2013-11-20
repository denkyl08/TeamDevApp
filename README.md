TeamDevApp
==========

A simple, scriptable, real-time collaborative web app for testing and development teams. 



###ToDos###

1. Project Nav
  * Build backend for servicing project list queries (can contain mock data for now)

2. Chat
  * Add timestamp data
  * real-time angular chat service (long-polling or socket.IO?)
  * WYSIWYG editor?

3. Search Functionality

###RESTful API###
For maximum flexibility/scriptability we will need a RESTful API
Proposal:

/api/projectlist

```javascript
[
	{
		properties : {
			title: "projectName1", 
			id: 1234
		},		
		children : [
		]
	}
]
```

/api/project/[id]

```javascript
{
  properties : {
    title: "projectName1",
    id: 1234
  },
  chatLog : [
    {
      username: "Kyle",
      id: 0,
      timestamp: 2456675434,
      text : "first post!"
    }
  ]
  custom: {
    whateverCustomProperty: "example",
    listOfThingsToDo: [
      {1: "file bug"},
      {2: "fix"},
      {3: "test fix"}
    ]
  }
}
```
