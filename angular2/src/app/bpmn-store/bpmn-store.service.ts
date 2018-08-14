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

    // public listDiagrams(): Observable<Link[]> {
    //     // console.log('listDiagrams');
    //     // This could be async and coming from a server:

    //     // TODO: async read from folder via fs read async
    //     return Observable.of([
    //         new Link('/diagrams/scrum.bpmn'),
    //         new Link('/diagrams/initial.bpmn'),
    //         new Link('/diagrams/initial2.bpmn'),
    //         new Link('/diagrams/pizza-collaboration.bpmn')
    //     ]).delay(2);
    // }

    public paletteEntries(): Observable<any> {
        // This could be async and coming from a server:
        return Observable.of({
            [COMMANDS.TWO_COLUMN] : {
                group: 'row',
                className: ['fa-th-large', 'fa'],
                title: COMMANDS.TWO_COLUMN,
                action: {
                    click: () => console.log('two-column')
                }
            },
          [COMMANDS.SAVE] : {
            group: 'row',
            className: ['fa-save', 'fa'],
            title: 'Export to BPMN',
            action: {
              click: () => console.log('save')
            }
          },
          [COMMANDS.SAVETODB] : {
            group: 'row',
            className: ['fa-database', 'fa'],
            title: 'Save to Database',
            action: {
              click: () => console.log('save')
            }
          },
            [COMMANDS.SET_IPIM_VALUES]: {
                group: 'ipim',
                className: ['fa-cog', 'fa'],
                title: 'Set Variables',
                action: {
                    click: () => console.log('openVariableModal')
                }
            },
             [COMMANDS.SET_IPIM_VALUES_EVALUATE]: {
                group: 'ipim',
                className: ['fa-cogs', 'fa'],
                title: 'Evaluate Process',
                action: {
                    click: () => console.log('openInputModal')
                }
            },
            [COMMANDS.RESET]: {
                group: 'ipim',
                className: ['fa-undo', 'fa'],
                title: 'Reset Diagram',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.SET_TERM]: {
                group: 'ipim',
                className: ['fa-tasks', 'fa'],
                title: 'Set Term',
                action: {
                    click: () => console.log('openTermModal')
                }
            },
            [COMMANDS.HIGHLIGHT]: {
                group: 'ipim',
                className: ['fa-lightbulb-o', 'fa'],
                title:  'Highlight Elements',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.SET_IPIM_EVALUATOR]: {
                group: 'ipim',
                className: ['fa-cubes', 'fa'],
                title: 'Start cascading Evaluation',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_EVALUATOR)
                }
            },
            [COMMANDS.SET_IPIM_SUBPROCESS]: {
                group: 'ipim',
                className: ['fa-object-group', 'fa'],
                title: 'Set Subprocess',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_SUBPROCESS)
                }
            }
        }).delay(1);
    }
}
