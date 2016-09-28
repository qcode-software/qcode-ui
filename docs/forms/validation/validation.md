# Validation plugin

This plugin provides server-side validation of a form through use of ajax requests.

When validation is successful the plugin will parse the response from the server and provide feedback to the user through use of tooltips that are directed at specific form elements and general messages. By default, if all inputs are valid then the form will be resubmitted without validation.

## Tooltips

A plugin called [qTip2](http://qtip2.com/) is used to display helpful tooltips that inform the user about any problems with specific input.

![qtip-example](https://cloud.githubusercontent.com/assets/8330836/18712248/774b9062-8005-11e6-9abe-acc9f9e7093f.png)

qcode-ui provides a default style for qTips however this can be overidden through the plethora of options qTip has available. See [qtip](#qtip) in the [Options](#options) section below for more information.

## Messages

Messages are a means of indicating general feedback to the user and there are three types: `error`, `alert`, and `notify`.

![error-message-example](https://cloud.githubusercontent.com/assets/8330836/18712257/7c780e1c-8005-11e6-8b28-c0f152658193.png)
![alert-message-example](https://cloud.githubusercontent.com/assets/8330836/18712260/7dbfbc8e-8005-11e6-9510-a516109898d6.png)
![notify-message-example](https://cloud.githubusercontent.com/assets/8330836/18712254/7acd0f68-8005-11e6-9755-bf24b6e7e682.png)

Each message is dimissable by clicking on it and has a default style provided by qcode-ui. You can customise the styles by overwritting the `classes` property when setting up the plugin – see [messages](#messages-1) in the [Options](#options) section for more information

### Message Structure

Messages are constructed using `div` elements with the parent `div` using classes from the [messages](#messages-1) option. The child `div` element will always have the class `message-content`.

Below is an example of the HTML for the error message shown above:

```html
<div class="message-area error">
  <div class="message-content">This is an error message.</div>
</div>
```

# Options

## messages
**Type**: object

**Defaults**:
```javascript
messages {
    error: {
        classes: 'message-area error'
    },
    alert: {
        classes: 'message-area alert'
    },
    notify: {
        classes: 'message-area notify'
    }
}
```

The position of messages in the DOM can be specified through use of `before` and `after` properties. If neither `before` or `after` are specified then the message will be appended to the `body` element. 

The styling of messages can be customised by overwriting the `classes` property and providing your own CSS files in the response to the client.

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

# Usage Examples

[Invalid Input](http://codepen.io/priyank-qcode/pen/OXKAKE)

This example displays tooltips on form inputs that have invalid input.

[Saving A Form](http://codepen.io/priyank-qcode/pen/pbrmZz)

This example shows how a form can be saved with a notification message returned to inform the user.


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