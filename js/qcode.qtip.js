;var qcode = qcode || {};

qcode.Qtip = class {
    options
    element
    
    constructor(target, options) {
        this.options = qcode.deepCopy(qcode.Qtip.options, options);
        this.element = document.createElement('div');
        this.element.classList.add('qtip');
        this.element.append(options.content);
        this.options.position.wrapper.append(this.element);
    }
};
qcode.Qtip.options = {
    position: {
        my: 'bottom center',
        at: 'bottom center',
        wrapper: document.body
    }
};

qcode.Qtip.pointer = class {
    element
    
    set facing(newFacing) {
        qcode.setStateClass(
            this.element,
            `qtip-pointer--${newFacing}`,
            ['qtip-pointer--top',
             'qtip-pointer--right',
             'qtip-pointer--bottom',
             'qtip-pointer--left']
        );
    }
    
    get facing() {
        for (const facing of ['left','right','top','bottom']) {
            if ( this.element.classList.contains(
                `qtip-pointer--${facing}`
            )) {
                return facing;
            }
        }
        return "";
    }

    set alignment(newAlignment) {
        qcode.setStateClass(
            this.element,
            `qtip-pointer--at-${newAlignment}`,
            ['qtip-pointer--at-top',
             'qtip-pointer--at-left',
             'qtip-pointer--at-bottom',
             'qtip-pointer--at-right',
             'qtip-pointer--at-center']
        );
    }

    get alignment() {
        for (const facing of ['left','right','top','bottom','center']) {
            if ( this.element.classList.contains(
                `qtip-pointer--at-${facing}`
            )) {
                return facing;
            }
        }
        return "";
    }
    
    constructor(parent) {
        this.element = document.createElement('div');
        this.element.classList.add('qtip-pointer');
        parent.append(this.element);
    }
};
