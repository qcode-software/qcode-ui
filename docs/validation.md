# Validation plugin

This plugin provides server-side validation of a form through use of ajax requests.

When validation is successful the plugin will parse the response from the server and provide feedback to the user through use of tooltips and general messages. By default, if all inputs are valid then the form will be resubmitted without validation.

## Tooltips

A plugin called [qTip2](http://qtip2.com/) is used to display helpful tooltips that inform the user about any problems with specific input.

<image>

qcode-ui provides a default style for qTips however this can be overidden through the plethora of options qTip has available. See the Options section below for more information.

## Messages

Messages are a means of indicating general feedback to the user and there are three types: `error`, `alert`, and `notify`.

<image error>
<image alert>
<image notify>

Each message has a default style provided by qcode-ui that can be overwritten through use of the `classes` preoperty when setting up the plugin – see the Options section below for more information

# Options

## messages
**Type**: object

The position of messages in the DOM can be specified through use of `before` and `after` properties. If neither `before` or `after` are specified then the message will be appended to the `body` element. 

Each message type has a default `classes` property of `message-area <type>`. You can customise the styling of message types by overwriting the `classes` property and providing your own CSS.

### Example 
```javascript
$('#myForm').validation({ 
  messages: {
      error: {
          before: '#form'
      },
      alert: {
          after: '[name=form]'
      },
      notify: {
          before: 'form',
          classes: 'myClass'
      }
  }
});
```

## submit
**Type**: boolean
**Default**: `true`

When this option is set to `true` the form will automatically be resubmitted to the server without validation if all inputs are valid. Setting this option to `false` will prevent this behaviour.

### Example
```javascript
$('#myForm').validation({submit: false});
```

## qtip
**Type**: object

**Defaults**:
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

For more information about qTip options please see the [qTip documentation](http://qtip2.com/options).

### Example
```javascript
$('#myForm').validation({
    qtip: {    
        position: {	
            my: 'left center',
            at: 'right center'
        }
    }
});
```

## timeout
**Type**: int
**Default**: 20000

Timeout for the ajax request in milliseconds.

### Example
```javascript
$('#myForm').validation({timeout: 5000});
```

# Public Functions

## $('form').validation('parseResponse', response)
`response` – JSON

Parses the given response and displays qTips and the messages where necessary.

## $('form').validation('showValidationMessage', element, message)
`element` –  jQuery selection
`message` – string

Displays the given message as a tooltip for the given element using qTip.

## $('form').validation('hideValidationMessage', element)
`element` – jQuery selection

Hides the tooltip for the given element.

## $('form').validation('showMessage', type, message)
`type` – string: "error", "notify", or "alert"
`message` – string

Displays the given message in a message area of the given type.
Position of the message can be customised by using the `messages` option.

## $('form').validation('hideMessage', type)
`type` – string: "error", "notify", or "alert"

Hides the message of the given type.

## $('form').validation('getMessage', type)
`type` – string: "error", "notify", or "alert"

Returns the jQuery object for the message of the given type.

## $('form').validation('reposition')
Repositions or hides all of the validation messages where appropriate.

## $('form').validation('setValuesFromResponse', response)
`response` – JSON

Sets form element values as defined by the response. 