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

    it('gets default method from html', async() => {
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            return validation.options.method
        });
        expect(result).toBe('VALIDATE');
    });

    it('gets default method from html', async() => {
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            form.setAttribute('method','POST');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            return validation.options.method
        });
        expect(result).toBe('POST');
    });

    it('submits a request and fires valid event', async () => {
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
            document.getElementById('submitButton').click();
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
            document.getElementById('submitButton').click();
            await valid;
            return [
                document.getElementById('username').value,
                document.getElementById('role').value
            ];
        });
        expect(result).toEqual(['Adam','Admin']);
    });

    it('Shows mesage area from response', async() => {
        page.on('request', interceptedRequest => {
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: "invalid",
                    message: {
                        error: {
                            value: "This is an error."
                        }
                    }
                })
            });
        });
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            const invalidEvent = new Promise(resolve => {
                form.addEventListener('invalid', event => {
                    resolve("Done");
                });
            });
            document.getElementById('submitButton').click();
            await invalidEvent;
            const messageArea = document.getElementsByClassName(
                'message-area'
            );
            return messageArea[0].innerText;
        });
        expect(result).toBe('This is an error.');
    });

    it('Displays feedback qtip', async() => {
        page.on('request', interceptedRequest => {
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: "invalid",
                    record: {
                        username: {
                            valid: false,
                            message: "I don't like your name."
                        }
                    }
                })
            });
        });
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            const invalid = new Promise(resolve => {
                form.addEventListener('invalid', event => {
                    resolve("Done");
                });
            });
            document.getElementById('submitButton').click();
            await invalid;
            const messageArea = document.getElementsByClassName(
                'qtip'
            );
            return messageArea[0].innerText;
        });
        expect(result).toBe("I don't like your name.");
    });

    it('Ignores unmatched records', async() => {
        page.on('request', interceptedRequest => {
            interceptedRequest.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: 'invalid',
                    record: {
                        username: {
                            valid: false,
                            message: "I don't like your name."
                        },
                        height: {
                            valid: true,
                            value: ''
                        },
                        role: {
                            valid: true,
                            value: 'Admin'
                        }
                    }
                })
            });
        });
        const result = await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form, {
                submit: false
            });
            const invalid = new Promise(resolve => {
                form.addEventListener('invalid', event => {
                    resolve("Done");
                });
            });
            document.getElementById('submitButton').click();
            await invalid;
            const messageArea = document.getElementsByClassName(
                'qtip'
            );
            return messageArea[0].innerText;
        });
        expect(result).toBe("I don't like your name.");
    });

    it('Submits form on success', async() => {
        const redirect = new Promise(resolve => {
            page.on('request', interceptedRequest => {
                if ( interceptedRequest.method() === 'POST' ) {
                    interceptedRequest.respond({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({status: 'valid'})
                    });
                } else {
                    interceptedRequest.respond({
                        status: 200,
                        contentType: 'text/html',
                        body:`<!doctype html>
<title>Simple Page</title>
<p>A simple html page`
                    });
                    resolve("Done");
                }
            });
        });
        await page.evaluate(async () => {
            const form = document.getElementById('testForm');
            const validation = new qcode.Validation(form);
            document.getElementById('submitButton').click();
        });
        await redirect;
    });

    it('Handles form submit method being masked by inputElement id "submit"',
       async() => {
           const redirect = new Promise(resolve => {
               page.on('request', interceptedRequest => {
                   if ( interceptedRequest.method() === 'POST' ) {
                       interceptedRequest.respond({
                           status: 200,
                           contentType: 'application/json',
                           body: JSON.stringify({status: 'valid'})
                       });
                   } else {
                       interceptedRequest.respond({
                           status: 200,
                           contentType: 'text/html',
                           body:`<!doctype html>
<title>Simple Page</title>
<p>A simple html page`
                       });
                       resolve("Done");
                   }
               });
           });
           await page.evaluate(async () => {
               const form = document.getElementById('testForm2');
               const validation = new qcode.Validation(form);
               document.getElementById('submit').click();
           });
           await redirect;
       });
});
