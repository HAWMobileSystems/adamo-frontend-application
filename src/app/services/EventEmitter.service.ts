
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Model } from '../models/model';
import { CollaborationModelEntity } from '../models/CollaborationModelEntity';
@Injectable()
export class EventEmitterService {
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    private emitModelSelect = new Subject<any>();
    // Observable string streams
    changeEmitted$  = this.emitChangeSource.asObservable();
    emitModelSelected$ = this.emitModelSelect.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    emitOnModelSelected(model: any) {
        console.log("emitOnModelSelected", model)
        this.emitModelSelect.next(model);
    }
}