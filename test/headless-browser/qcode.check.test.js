describe('qcode.check plugin',() => {
    let page;

    beforeEach(async () => {
        page = await ready_page('qcode.check.test.html');
        await page.setRequestInterception(true);
    });

    afterEach( () => page.close() );

    it('runs without error', async () => {
        const result = await page.evaluate(async () => {
            const check = new qcode.Check(document.getElementById('form'), {
                '[name="username"]': qcode.Check.required,
                '[name="birth_date"]': {
                    check: field => qcode.Check.isDate(field.value),
                    message: "DoB must be a date"
                },
                '[name="team_no"]': {
                    check: field => qcode.Check.isInteger(field.value),
                    message: "Team No. must be an integer"
                },
                '[name="address_line1"]': qcode.Check.required,
                '[name="postcode"]': {
                    check: field => qcode.Check.isPostcode(field.value),
                    message: "Invalid postcode"
                },
                '[name="email"]': {
                    check: field => qcode.Check.isEmail(field.value),
                    message: "Invalid email"
                }
            });

            const valid = check.validate();
            return valid;
        });
        expect(result).toBe(false);
    });
});
