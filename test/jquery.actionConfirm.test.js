test('jquery.actionConfirm 1', () => {
    document.body.innerHTML = '<a id="link" href="#test">Click</a>';

    $('#link').actionConfirm();

    document.getElementById('link').dispatchEvent(new MouseEvent('click'));

    for (let button of document.getElementsByTagName('button')) {
        if ( button.innerHTML == 'Yes' ) {
            button.dispatchEvent(new MouseEvent('click'));
            return;
        }
    }

    expect(window.location).toBe('#test');
});

test('jquery.actionConfirm 2', () => {
    document.body.innerHTML = '<a id="link" href="#test">Click</a>';

    $('#link').actionConfirm();

    document.getElementById('link').dispatchEvent(new MouseEvent('click'));

    for (let button of document.getElementsByTagName('button')) {
        if ( button.innerHTML == 'No' ) {
            button.dispatchEvent(new MouseEvent('click'));
            return;
        }
    }

    expect(window.location).toBe('');
});
