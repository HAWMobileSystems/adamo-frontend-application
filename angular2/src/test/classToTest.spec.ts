describe('Meaningful Test', () => {
    it('1 + 1 => 2', () => {
        expect(1 + 1).toBe(2);
    });

    it('1 + 1 => !3', () => {
        expect(1 + 1).not.toBe(3);
    });

    it('null should be null', () => {
        expect(null).toBe(null);
    });

});