describe('Date', () => {
    describe('positive integer', () => {
        var testDate = new Date('2020-01-01 09:30:00');
        testDate.incrDays(3);
        assert.equal(
            testDate.toISODateString(),
            '2020-01-04'
        );
    });
});
