import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { COMMANDS } from './commandstore.service';

import {faChevronLeft, faChevronRight} from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';

export class Link {
    constructor(public readonly href: string, public readonly text?: string, public readonly rel?: string) {
        this.text = text || href;
        this.rel = rel || 'none';
    }
}

@Injectable()
export class BPMNStore {

    constructor(private http: Http) {
        fontawesome.library.add(faChevronLeft, faChevronRight);
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
                className: ['fa', 'fa-th-large', 'fa-lg'],
                title: COMMANDS.TWO_COLUMN,
                action: {
                    click: () => console.log('two-column')
                }
            },
          [COMMANDS.SAVE] : {
            group: 'row',
            className: ['fa-arrow-circle-down', 'glyphicfaon'],
            title: 'Export to BPMN',
            action: {
              click: () => console.log('save')
            }
          },
          [COMMANDS.SAVETODB] : {
            group: 'row',
            className: ['fa-cloud-upload-alt', 'fa'],
            title: 'Save to Database',
            action: {
              click: () => console.log('save')
            }
          },
            [COMMANDS.SET_IPIM_VALUES]: {
                group: 'ipim',
                className: ['fa-cog', 'fas'],
                title: 'Set Variables',
                action: {
                    click: () => console.log('openVariableModal')
                }
            },
            [COMMANDS.SET_TERM]: {
                group: 'ipim',
                className: ['fa-tasks', 'fas'],
                title: 'Set Term',
                action: {
                    click: () => console.log('openTermModal')
                }
            },
            [COMMANDS.SET_IPIM_VALUES_EVALUATE]: {
                group: 'ipim',
                className: ['fa-tag', 'fas'],
                title: 'Evaluate Process',
                action: {
                    click: () => console.log('openInputModal')
                }
            },
            [COMMANDS.SET_IPIM_EVALUATOR]: {
                group: 'ipim',
                className: ['fa-tags', 'fas'],
                title: 'Start cascading Evaluation',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_EVALUATOR)
                }
            },
            [COMMANDS.SET_IPIM_SUBPROCESS]: {
                group: 'ipim',
                className: ['fa-list-alt', 'fas'],
                title: 'Set Subprocess',
                action: {
                    click: () => console.log(COMMANDS.SET_IPIM_SUBPROCESS)
                }
            },
            [COMMANDS.OPEN_SUBPROCESS_MODEL]: {
                group: 'ipim',
                className: ['fa-download', 'fas'],
                title: 'Open Model of Subprocess',
                action: {
                    click: () => console.log(COMMANDS.OPEN_SUBPROCESS_MODEL)
                }
            },
            [COMMANDS.HIGHLIGHT]: {
                group: 'ipim',
                className: ['fa-tint', 'fas'],
                title:  'Highlight Elements',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.RESET]: {
                group: 'ipim',
                className: ['fa-undo', 'fas'],
                title: 'Reset Diagram',
                action: {
                    click: () => console.log('two-column')
                }
            },
            [COMMANDS.OPEN_USAGE_MODEL]: {
                group: 'ipim',
                className: ['fa-share', 'fas'],
                title: 'See Processes references',
                action: {
                    click: () => console.log('two-column')
                }
            }
        }); //.delay(1);
    }
}
