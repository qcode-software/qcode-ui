describe('qcode.validation plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.validation.test.html');
        await page.setRequestInterception(true);
        page.on('console', message => {
            console.log(message.text());
        });
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
        let countRequests = 0;
        page.on('request', interceptedRequest => {
            countRequests++;
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: "valid"
                })
            })
        });
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            const valid = new Promise(resolve => {
                form.addEventListener('valid', event => {
                    resolve(event.detail.response)
                });
            });
            document.getElementById('submit').click();
            await valid;
            return;
        });
        expect(countRequests).toBe(1);
    });

    it('Can set values from response', async () => {
        page.on('request', interceptedRequest => {
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: "valid",
                    record: {
                        username: {
                            valid: true,
                            value: "Adam"
                        },
                        role: {
                            valid: true,
                            value: "Admin"
                        }
                    }
                })
            })
        });
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            const valid = new Promise(resolve => {
                form.addEventListener('valid', event => {
                    validation.setValuesFromResponse(
                        event.detail.response
                    );
                    resolve("Done");
                });
            });
            document.getElementById('submit').click();
            await valid;
            return [
                document.getElementById('username').value,
                document.getElementById('role').value
            ];
        });
        expect(result).toEqual(['Adam','Admin']);
    });
});
