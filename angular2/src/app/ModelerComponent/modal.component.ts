import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <modal #myFirstModal>
            ...
        </modal>
        <modal #mySecondModal>
            ...
        </modal>
        <modal #termModal>
            ...
        </modal>
    `
})
export class ParentComponent {
    @ViewChild('myFirstModal')
    private modal1: ModalComponent;
    @ViewChild('mySecondModal')
    private modal2: ModalComponent;
    @ViewChild('termModal')
    private termModal: ModalComponent;
}