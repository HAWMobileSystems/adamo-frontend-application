import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule} from '@angular/router/testing';
describe('App', () => {
    beforeEach(() => {
        // this.app = new AppComponent();
        TestBed.configureTestingModule({ declarations: [AppComponent], imports: [ RouterTestingModule ]});
    });
    it ('should work', () => {
        const fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

    it('should create modeler on startup', () => {
        TestBed.configureTestingModule({declarations: []}).compileComponents();

    });
});
