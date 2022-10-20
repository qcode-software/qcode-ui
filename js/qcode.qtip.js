;var qcode = qcode || {};

qcode.Qtip = class {
    target
    options
    element
    pointer
    _resizeListener
    _hideThis
    _boundHideEvents = []
    
    constructor(target, options) {
        this.target = target;
        
        this.options = qcode.deepCopy(qcode.Qtip.options, options);
        if ( ! this.options.container ) {
            this.options.container = document.body;
        }

        this._hideThis = this.hide.bind(this);
        
        this.element = document.createElement('div');
        this.element.classList.add('qtip');
        this.element.classList.add('qcode-qtip');
        this.element.append(options.content);

        for (const className of this.options.classes) {
            this.element.classList.add(className);
        }

        this.options.container.append(this.element);
        
        this.pointer = new qcode.Qtip.pointer(this.element);

        this.set_content(this.options.content);
        this.show();

        this._resizeListener = this.reposition.bind(this);
        window.addEventListener('resize',this._resizeListener);

        this.element.addEventListener('click', event => {
            this.target.focus();
            this.hide();
        });
    }

    show() {
        window.addEventListener('resize',this._resizeListener);
        this.element.style.display = 'block';
        this.reposition();

        for (const event of this.options.hide_events) {
            this._boundHideEvents.push(event);
            this.target.addEventListener(event, this._hideThis);
        }
    }

    hide() {
        window.removeEventListener('resize',this._resizeListener);
        this.element.style.display = 'none';

        for (const event of this._boundHideEvents) {
            this.target.removeEventListener(event, this._hideThis);
        }
        this._boundHideEvents = [];
    }

    is_showing() {
        return (this.element.style.display == 'block');
    }

    set_content(new_content) {
        this.options.content = new_content;
        this.element.innerHTML = new_content;
        this.element.append(this.pointer.element);
    }

    reposition() {
        this.set_anchor_point(
            this.get_anchor_point(
                this.target,
                this.options.position.at
            )
        );
    }

    set_anchor_point(point) {
        const rect = this.element.getBoundingClientRect();

        const [facing, alignment] = this._parse_position_my(
            this.options.position.my
        );

        this.pointer.facing = facing;
        this.pointer.alignment = alignment;

        const left = this._get_left(facing, alignment, point, rect.width);
        const top = this._get_top(facing, alignment, point, rect.height);
        
        this.element.style.setProperty('left', `${left}px`);
        this.element.style.setProperty('top', `${top}px`);
    }

    get_anchor_point(target, position) {
        let rect = this._getDocumentRect(target);
        if ( ! (this.options.container instanceof HTMLBodyElement) ) {
            const containerRect = this._getDocumentRect(this.options.container);
            rect = this._translateRect(rect, {
                x: -containerRect.x,
                y: -containerRect.y
            });
        }
        const horizontal_vertical = this._parse_position_at(position);
        
        return {
            x: this._get_x(rect, horizontal_vertical[0]),
            y: this._get_y(rect, horizontal_vertical[1])
        }
    }

    _getDocumentRect(element) {
        const clientRect = element.getBoundingClientRect();
        return this._translateRect(
            clientRect,
            {x: window.scrollX, y: window.scrollY}
        );
    }

    _translateRect(rect, vector) {
        return new DOMRect(
            rect.x + vector.x,
            rect.y + vector.y,
            rect.width,
            rect.height
        );
    }

    _parse_position_my(position) {
        const parts = position.split(' ');
        let facing, alignment;
        if ( parts[0] == 'center' ) {
            return [
                parts[1] || 'center',
                parts[0]
            ];
        } else {
            return [
                parts[0],
                parts[1] || 'center'
            ];
        }
    }

    _parse_position_at(position) {
        const parts = position.split(' ');

        if ( parts.length == 1 ) {
            parts.push('center');
        }

        for (const horizontal of ['left','center','right']) {
            for (const vertical of ['top','center','bottom']) {
                if ( (parts[0] == horizontal && parts[1] == vertical)
                     ||
                     (parts[1] == horizontal && parts[0] == vertical)
                   ) {
                    return [horizontal, vertical];
                }
            }
        }
        throw `Ambiguous position ${position}`;
    }

    _get_left(facing, alignment, point, width) {
        const pointer_width = 8;
        switch (facing) {
        case 'left':
            return point.x + pointer_width;
        case 'right':
            return point.x - pointer_width - width;
        default:
            switch (alignment) {
            case 'left':
                return point.x;
            case 'right':
                return point.x - width;
            default:
                return point.x - (width / 2.0);
            }   
        }
    }

    _get_top(facing, alignment, point, height) {
        const pointer_height = 8;
        switch (facing) {
        case 'top':
            return point.y + pointer_height;
        case 'bottom':
            return point.y - pointer_height - height;
        default:
            switch (alignment) {        
            case 'top':
                return point.y;
            case 'bottom':
                return point.y - height;
            default:
                return point.y - (height / 2.0)
            }
        }
    }

    _get_x(rect, horizontal) {
        switch (horizontal) {
        case 'left':
            return rect.left;
        case 'right':
            return rect.right;
        case 'center':
            return (rect.left + rect.right) / 2.0;
        }
        throw `Invalid horizontal ${horizontal}`;
    }

    _get_y(rect, vertical) {
        switch (vertical) {
        case 'top':
            return rect.top;
        case 'bottom':
            return rect.bottom;
        case 'center':
            return (rect.top + rect.bottom) / 2.0;
        }
        throw `Invalid vertical ${vertical}`;
    }
};

qcode.Qtip.options = {
    content: "",
    position: {
        my: 'bottom center',
        at: 'bottom center'
    },
    classes: [],
    hide_events: [
        'click',
        'focus',
        'blur',
        'keydown',
        'paste',
        'cut'
    ]
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
             'qtip-pointer--left',
             'qtip-pointer--center']
        );
    }
    
    get facing() {
        for (const facing of ['left','right','top','bottom','center']) {
            if ( this.element.classList.includes(
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
            if ( this.element.classList.includes(
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
    }
};
