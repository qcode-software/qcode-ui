test('jquery.columnsShowHideControl', () => {
    const filesystem = require('fs');
    const fragment = filesystem
          .readFileSync('./test/jquery.columnsShowHide.test.html');
    document.body.innerHTML = fragment;

    expect( document.getElementById('apples').style.display ).toBe('table-cell')
});
