global.window = window;
global.$ = global.jQuery = require('./external/jquery-3.5.1.min');
require('./external/jquery-ui-1.12.1.custom.min');

(function(){
    const fs = require('fs');
    var source = "";
    fs.readdirSync('./js/').sort().forEach(filename => {
        if ( filename.slice(-3) === '.js' ) {
            require('./js/' + filename);
        }
    });
})();

/*eval((function(){
    const fs = require('fs');
    var source = "";
    fs.readdirSync('./js/').sort().forEach(filename => {
        if ( filename.slice(-3) === '.js' ) {
            source += fs.readFileSync('./js/' + filename);
        }
    });
    return source;
})());*/
