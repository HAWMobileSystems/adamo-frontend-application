import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { COMMANDS } from './commandstore.service';

export class Link {
    constructor(public readonly href: string, public readonly text?: string, public readonly rel?: string) {
        this.text = text || href;
        this.rel = rel || 'none';
    }
}

@Injectable()
export class BPMNStore {

    constructor(private http: Http) {
    }

    public listDiagrams(): Observable<Link[]> {
        // console.log('listDiagrams');
        // This could be async and coming from a server:
        return Observable.of([
            new Link('/diagrams/initial.bpmn'),
            new Link('/diagrams/pizza-collaboration.bpmn')
        ]).delay(2000);
    }

    public paletteEntries(): Observable<any> {
        // This could be async and coming from a server:
        return Observable.of({
            [COMMANDS.SAVE] : {
                group: 'row',
                className: ['fa-th-large', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.SET_IPIM_VALUES]: {
                group: 'ipim',
                className: ['fa-cog', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
             [COMMANDS.SET_IPIM_VALUES_EVALUATE]: {
                group: 'ipim',
                className: ['fa-cogs', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.RESET]: {
                group: 'ipim',
                className: ['fa-undo', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.SET_TERM]: {
                group: 'ipim',
                className: ['fa-tasks', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.HIGHLIGHT]: {
                group: 'ipim',
                className: ['fa-lightbulb-o', 'fa'],
                title: 'Multi Row',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.EXTRA]: {
                group: 'storage',
                className: ['fa-coffee', 'fa'],
                title: 'EXTRA',
                action: {
                    click: () => console.log('EXTRA')
                }
            }
        }).delay(1000);
    }
}
