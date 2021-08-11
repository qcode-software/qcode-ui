// Implement offsetParent for jest testing (jsdom does not provide)
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    get() {
        var element = this;
        if ( $(element).css('display') === 'none'
             || $(element).css('position') === 'fixed'
             || element.nodeName === 'BODY'
             || element.nodeName === 'HTML' ) {
            return null;
        }
        if ( this.parentNode === null
             || this.parentNode.nodeName === 'TD'
             || this.parentNode.nodeName === 'TH'
             || this.parentNode.nodeName === 'TABLE'
             || $(this.parentNode).css('position') !== 'static'
           ) {
            return this.parentNode;
        }
        return this.parentNode.offsetParent;
    },
});
