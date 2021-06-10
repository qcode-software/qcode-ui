test('jquery.actionConfirm', () => {
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
