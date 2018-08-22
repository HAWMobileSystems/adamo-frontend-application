import {isSuccess} from '@angular/http/src/http_utils';
import {UserComponent} from '../app/components/UserComponent/user.component';

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

/*
    it('email validation', () => {
        let email = new UserComponent();
        expect(email.valid).toBe(false);

*/

    /*
    describe('Login Test', () => {
        it('User: masood => TRUE', () => {
            expect(this.loading = true).toBe(isSuccess);
        }
    }*/
});
