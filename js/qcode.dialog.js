// qcode dialog plugin
;var qcode = qcode || {};
qcode.Dialog = (function(undefined) {
    "use strict";

    const defaults = {
        title: "",
        resizable: true,
        buttons: {},
        modal: false,
        classes: {},
        persist: false,
        autoOpen: true
    }
    
    const Dialog = function(content, options) {
        const parser = new DOMParser();
        let config = Object.create(defaults);
        for (const property in options) {
            if ( property == "buttons" ) {
                continue;
            }
            config[property] = options[property];
        }

        if ( options.buttons instanceof Array ) {
            config.buttons = options.buttons;
        } else {
            config.buttons = [];
            for (const text in options.buttons) {
                let button = {
                    text: text
                };
                if ( typeof options.buttons[text] === "function" ) {
                    button.click = options.buttons[text];
                }
                config.buttons.push(button);
            }
        }
                
        const doc = parser.parseFromString(
            `<dialog class="dialog">
<h1 class="dialog__title">${config.title}</h1>
<div class="dialog__content"></div>
<footer class="dialog__footer">
<form method="dialog" class="dialog__buttons">
</form>
</footer>
</dialog>`,
            'text/html');

        for ( const targetClass in config.classes ) {
            const elements = doc.getElementsByClassName(targetClass);
            Array.from(elements).forEach((element) => {
                element.classList.add(config.classes[targetClass]);
            });
        }
        
        const div = doc.getElementsByClassName('dialog__content')[0];
        div.append(content);

        const dialog = doc.getElementsByClassName('dialog')[0];
        document.body.append(dialog);

        const buttons = dialog.getElementsByClassName('dialog__buttons')[0];
        config.buttons.forEach(buttonConfig => {
            let button = document.createElement('button');
            button.className = "dialog__button";
            button.innerHTML = buttonConfig.text;
            button.value = buttonConfig.text;
            buttons.append(button);
            ['click','keydown'].forEach(eventName => {
                if ( typeof buttonConfig[eventName] === "function" ) {
                    button.addEventListener(eventName, buttonConfig[eventName]);
                }
            });
        });
        
        dialog.addEventListener('close',(event) => {
            if ( ! config.persist ) {
                dialog.remove();
            }
        });

        if ( config.resizable ) {
            dialog.style.resize = "both";
        }
        if ( config.width != undefined ) {
            dialog.style.width = options.width;
        }
        if ( config.height != undefined ) {
            dialog.style.height = options.height;
        }

        if ( config.autoOpen ) {
            if ( config.modal ) {
                dialog.showModal();
            } else {
                dialog.show();
            }
        }
        
        return dialog;
    };
    
    return Dialog;
})();
