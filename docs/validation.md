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

```javascript
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

Allows user to customise timeout for the submit request. Default value is 20000.

# Public Functions

### $('form').validation('parseResponse',response)
### response
Type: JSON

Takes response as an argument and displays qtips and the messages where necessary by parsing the response.

### $('form').validation('showValidationMessage', element, messsage)
### element
Type: jQuery selection
### message
Type: string

Takes form element and message as arguments and displays the message as the tooltip for the given element using qtip.

### $('form').validation('hideValidationMessage', element)
### element
Type: jQuery selection

Hides tooltip for the given element.

### $('form').validation('showMessage', type, messsage)
### type
Possible values: error, notify or alert
### message
Type: string

Takes message and type as arguments and displays the message. Position of the message can be customised by using the ```messages``` option.

### $('form').validation('hideMessage', type)
### type
Possible values: error, notify or alert

Takes type of message as an argument and hides the message of the given type.

### $('form').validation('getMessage', type)
### type
Possible values: error, notify or alert

Takes type of message as an argument and returns the jQuery object for the message of the given type.

### $('form').validation('reposition')

Toggle funciton to reposition or hide all the validation messages.

### $('form').validation('setValuesFromResponse', response)
### response
Type: JSON

Takes the response as an argument and sets value of the form elements by parsing the response.