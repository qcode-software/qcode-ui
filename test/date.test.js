test('Date.incrDays positive integer', () => {
    var testDate = new Date('2020-01-01 09:30:00');
    testDate.incrDays(3);
    expect(testDate.toISODateString()).toBe('2020-01-04');
});
