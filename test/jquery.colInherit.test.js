test('colInherit test', () => {
    const fs = require('fs');
    const fragment = fs.readFileSync('./test/jquery.colInherit.test.html');
    
    document.body.innerHTML = fragment;

    $('table').colInherit({
        customAttributes: ["myAttribute"]
    });

    const row = $('tbody tr').first();
    const firstCell = row.find('td').first();
    expect( firstCell.css('width') ).toBe('130px');
    expect( firstCell.attr('class') ).toBe(undefined);
    expect( firstCell.attr('myAttribute') ).toBe('hello');
    
    const secondCell = row.find('td').eq(1);
    expect( secondCell.css('width') ).toBe('100px');
    expect( secondCell.attr('class') ).toBe('middle');
    expect( secondCell.attr('myAttribute') ).toBe(undefined);
    
    const thirdCell = row.find('td').eq(2);
    expect( thirdCell.css('width') ).toBe('120px');
    expect( thirdCell.css('font-style') ).toBe('italic');
    expect( thirdCell.css('color') ).toBe('grey');
    expect( thirdCell.attr('class') ).toBe(undefined);
    expect( thirdCell.attr('myAttribute') ).toBe(undefined);
});
