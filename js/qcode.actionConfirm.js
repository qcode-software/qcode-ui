// qcode actionConfirm plugin
;var qcode = qcode || {};
qcode.actionConfirm = function(target) {
    if ( target instanceof HTMLCollection ) {
        target = Array.from(target);
    }
    if ( target instanceof Array ) {
        target.forEach(qcode.actionConfirm);
        return
    }
    
    var yesFunction;
    if ( target.matches(`
button[type=submit],
button:not([type]),
input[type=submit],
input[type=button]`) ) {
        yesFunction = function() {
            qcode.closest(target,'form').requestSubmit();
        }
    } else if ( target.matches('a') ) {

        if ( ! target.disabled && ! target.hasAttribute('href') ) {
            throw '<a> must have an href property.';
        }
        
        yesFunction = function() {
            window.location = target.getAttribute('href');
        }
    } else {
        throw `Unsupported element ${target.tagName}.
actionConfirm only supports <a>, <button>, <input>.`;
    }

    target.addEventListener('click',event => {
        event.preventDefault();
        if ( target.disabled ) {
            return false;
        }
        
        let action;
        if ( target.hasAttribute('title') ) {
            action = target.getAttribute('title');
            
        } else if ( target.matches('a, button') ) {
            action = target.innerText;
            
        } else if ( target.hasAttribute('val') ) {
            action = target.getAttribute('val');
            
        } else if ( target.parentElement.matches('label')
                    && target.parentElement.innerText !== "" ) {
            action = target.parentElement.innerText;
            
        } else {
            action = "proceed";
        }

        // Display a modal dialog to confirm a user's action.
        let div = document.createElement('div');
        div.innerText = "Are you sure you wish to " + action + "?";
        qcode.Dialog(div,{
	    title: "Confirm Action",
	    buttons: {
		Yes: yesFunction,
		No: null
	    },
	    modal: true,
	    width: 400,
	    height: 200
	});
    });
};
