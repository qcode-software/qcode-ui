describe('qcode.validation plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.validation.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('can be initialised without error', async () => {
        const result = await page.evaluate(async () => {
            const validation = new qcode.Validation(
                document.getElementById('testForm')
            );
            return 'OK';
        });
        expect(result).toBe('OK');
    });

    it('applies classes on state change', async () => {
        const result = await page.evaluate(async () => {
            const classes = [];
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form);
            classes.push(form.classList.value);

            for (const state of ['error',
                                 'validating',
                                 'redirecting',
                                 'valid',
                                 'invalid'] ) {
                validation.state = state;
                classes.push(form.classList.value);
            }
            return classes;
        });
        expect(result).toEqual(['',
                                'error',
                                'validating',
                                'redirecting',
                                'valid',
                                'invalid']);
    });

    it('submits a request on submit', async () => {
        page.on('request', interceptedRequest => {
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: `{
                    status: "valid",
                    record: {
                        username: {
                            status: "valid",
                            value: "Adam"
                        },
                        role: {
                            status: "valid",
                            value: "Admin"
                        }
                    }
                }`
            })
        });
        await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form);
            const valid = new Promise(resolve => {
                form.addEventListener('valid', event => {
                    resolve(event.detail.response)
                });
            });
            form.submit();
            await valid;
            return [
                document.getElementById('username').value,
                document.getElementById('role').value
            ];
        });
        expect(countRequests).toEqual(['Adam','Admin']);
    });
});
