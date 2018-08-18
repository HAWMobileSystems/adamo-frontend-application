import {ApiService} from '../app/services/api.service';

describe('API Service Tests', () => {
    it('1 + 1 => 2', () => {
       // const apiservice: ApiService = new ApiService();
        expect(1 + 1).toBe(2);
    });

    it('1 + 1 => !3', () => {
        expect(1 + 1).not.toBe(3);
    });

    it('null should be null', () => {
        expect(null).toBe(null);
    });

});