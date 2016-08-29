# Validation plugin

This plugin is used with form element to validate user input using ajax.

# Options

### messages
Type: object, name-value pairs.

Allows user to set attribute such as position,classes etc. for message. Supports three different types of messages error, notify and alert. Message applies to the entire form.

### submit
Type: boolean.

Submits the form after validation is complete, if set to true(default). 
Prevents form submit after the validation is complete, if set to false.

### qtip
Type: object, name-value pairs.

Allows user to set qtip tooltip properties such as position, style, show, hide, events using name-value pair. Default values are:

```
qtip: {
    position: {
	my: 'bottom center',
	at: 'bottom center',
	viewport: $(window)
    },
    show: {
	event: false,
	ready: true
    },
    hide: {
	event: 'click focus blurs reset keydown paste cut',
	delay: 0
    },
    style: {
	classes: 'qtip-qcode'
    },
    events: {
	render: function(event, api) {
	    // Clicking on the tooltip causes the target element to gain focus and hides the tooltip.
	    api.elements.tooltip.on('click', function(event) {
		api.elements.target.focus();
		// Call the hide method in case the default hide events were overwritten
		api.hide();
	    });
	}
    }
}
```

### timeout
Type: time (milisecond)

Allows user to customise timeout for submit request. Default values is 20000.

