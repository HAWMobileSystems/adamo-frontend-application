import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
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
        return of({
            [COMMANDS.TWO_COLUMN] : {
                group: 'row',
                className: ['glyphicon-th-large', 'glyphicon'],
                title: COMMANDS.TWO_COLUMN,
                action: {
                    click: () => console.log('two-column')
                }
            },
          [COMMANDS.SAVE] : {
            group: 'row',
            className: ['glyphicon-circle-arrow-down', 'glyphicon'],
            title: 'Export to BPMN',
            action: {
              click: () => console.log('save')
            }
          },
          [COMMANDS.SAVETODB] : {
            group: 'row',
            className: ['glyphicon-cloud-upload', 'glyphicon'],
            title: 'Save to Database',
            action: {
              click: () => console.log('save')
            }
          },
            [COMMANDS.SET_IPIM_VALUES]: {
                group: 'ipim',
                className: ['glyphicon-cog', 'glyphicon'],
                title: 'Set Variables',
                action: {
                    click: () => console.log('openVariableModal')
                }
            },
            [COMMANDS.SET_TERM]: {
                group: 'ipim',
                className: ['glyphicon-tasks', 'glyphicon'],
                title: 'Set Term',
                action: {
                    click: () => console.log('openTermModal')
                }
            },
            [COMMANDS.SET_IPIM_VALUES_EVALUATE]: {
                group: 'ipim',
                className: ['glyphicon-tag', 'glyphicon'],
                title: 'Evaluate Process',
                action: {
                    click: () => console.log('openInputModal')
                }
            },
            [COMMANDS.SET_IPIM_EVALUATOR]: {
                group: 'ipim',
                className: ['glyphicon-tags', 'glyphicon'],
                title: 'Start cascading Evaluation',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_EVALUATOR)
                }
            },
            [COMMANDS.SET_IPIM_SUBPROCESS]: {
                group: 'ipim',
                className: ['glyphicon-list-alt', 'glyphicon'],
                title: 'Set Subprocess',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_SUBPROCESS)
                }
            },
            [COMMANDS.OPEN_SUBPROCESS_MODEL]: {
                group: 'ipim',
                className: ['glyphicon-download-alt', 'glyphicon'],
                title: 'Open Model of Subprocess',
                action: {
                    click: () => console.log(COMMANDS.OPEN_SUBPROCESS_MODEL)
                }
            },
            [COMMANDS.HIGHLIGHT]: {
                group: 'ipim',
                className: ['glyphicon-tint', 'glyphicon'],
                title:  'Highlight Elements',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.RESET]: {
                group: 'ipim',
                className: ['glyphicon-repeat', 'glyphicon'],
                title: 'Reset Diagram',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.OPEN_USAGE_MODEL]: {
                group: 'ipim',
                className: ['glyphicon-share', 'glyphicon'],
                title: 'See Processes references',
                action: {
                    click: () => console.log('two-column')
                }
            }
        }); //.delay(1);
    }
}
