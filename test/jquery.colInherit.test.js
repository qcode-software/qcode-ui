test('colInherit test', () => {
    const fs = require('fs');
    const fragment = fs.readFileSync('./test/jquery.colInherit.test.html');
    
    document.body.innerHTML = fragment;

    $('table').colInherit({
        customAttributes: ["myAttribute"]
    });

    const row = $('tbody tr').first();
    expect($('td').first().css('width')).toBe('130px');
    expect($('td').first().attr('myAttribute')).toBe('hello');
    expect($('td').index(1).hasClass('middle')).toBe(true);
});
