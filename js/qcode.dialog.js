// qcode dialog plugin
;var qcode = qcode || {};
qcode.Dialog = (function(undefined) {
    "use strict";
    
    var Dialog = function(content, options) {
        var parser = new DOMParser();
        
        var buttons = '';
        for (var text in options.buttons) {
            buttons += `<button
class="dialog__button"
value="${text}">
${text}</button>`;
        }
        
        var doc = parser.parseFromString(
            `<dialog class="dialog">
<h1 class="dialog__title">${options.title}</h1>
<div class="dialog__content"></div>
<footer class="dialog__footer">
<form method="dialog" class="dialog__buttons">
${buttons}
</form>
</footer>
</dialog>`,
            'text/html');
        var div = doc.getElementsByClassName('dialog__content')[0];
        div.append(content);

        var dialog = doc.getElementsByClassName('dialog')[0];
        document.body.append(dialog);
        dialog.addEventListener('close',function(event) {
            for (var text in options.buttons) {
                if ( dialog.returnValue == text) {
                    options.buttons[text].call(dialog);
                }
            }
        });

        if ( options.modal ) {
            dialog.showModal();
        } else {
            dialog.show();
        }

        if ( options.width != undefined ) {
            dialog.style.width = options.width;
        }
        if ( options.height != undefined ) {
            dialog.style.height = options.height;
        }
        
        return dialog;
    };
    
    return Dialog;
})();
