describe('qcode.calendar',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.calendar.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('runs without error', async () => {
        const result = await page.evaluate(async () => {
            const canvas = document.getElementById('calendar');
            const calendar = new qcode.Calendar(canvas, {
                startDate: new Date('2022-04-01'),
                finishDate: new Date('2022-05-31')
            });
            const bar = calendar.newBar({
                color: 'rgba(220,160,160,0.6)',
                height: 20,
                top: 80,
                startDate: new Date('2022-04-07'),
                finishDate: new Date('2022-05-24')
            });
            calendar.draw(false);
            return canvas.getAttribute('width');
        });
        expect(result).toBe("1220");
    });
});
