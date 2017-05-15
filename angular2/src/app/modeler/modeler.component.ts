import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { PaletteProvider } from './palette';
import { CustomPropertiesProvider } from './props-provider';
import { BPMNStore, Link } from "../bpmn-store/bpmn-store.service";

const modeler = require("bpmn-js/lib/Modeler.js");
const propertiesPanelModule = require('bpmn-js-properties-panel');
const propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');

import { CustomModdle } from './custom-moddle';
import { Observable, Subject } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';

import * as $ from 'jquery';


import { COMMANDS } from './../bpmn-store/commandstore.service'
const customPaletteModule = {
    paletteProvider: ['type', PaletteProvider]
};
const customPropertiesProviderModule = {
    __init__: ['propertiesProvider'],
    propertiesProvider: ['type', CustomPropertiesProvider]
};

const containerRef = '#js-canvas';
const propsPanelRef = '#js-properties-panel';

@Component({
    templateUrl: './modeler.component.html',
    styleUrls: ['./modeler.component.css'],
    providers: [BPMNStore]
})
export class ModelerComponent implements OnInit {
    private modeler: any;

    private url: string;
    // private urls: Link[];
    private extraPaletteEntries: any;
    private commandQueue: Subject<any>;

    constructor(private http: Http, private store: BPMNStore, private ref: ChangeDetectorRef) {
    }

    get urls(): Link[] {
        return this.urls;
    }

    set urls(u: Link[]) {
        console.log('urls: ', u);
        this._urls = u;
        this.url = u[0].href;
    }


    ngOnInit() {
        this.commandQueue = new Subject();
        this.commandQueue
            .subscribe(cmd => console.log('Received command: ', cmd));
        this.commandQueue
            .filter(cmd => COMMANDS.EXTRA === cmd.action)
            .subscribe(cmd => console.log('Received SUPER SPECIAL EXTRA command: ', cmd));

        this.commandQueue
            .filter(cmd => COMMANDS.TWO_COLUMN === cmd.action)
            .do(cmd => {
                console.log(COMMANDS.TWO_COLUMN, cmd);
                const palette = $('.djs-palette');
                palette.hasClass('two-column')
                    ? this.shrinkToOneColumn(palette)
                    : this.expandToTwoColumns(palette);
                this.ref.detectChanges;
            })
            .subscribe(cmd => console.log('Received SUPER SPECIAL two-column command: ', cmd));
        this.commandQueue
        .filter(cmd => COMMANDS.TWO_COLUMN === cmd.action)
        .do(cmd => {
        })

        this.commandQueue
            .filter(cmd => 'save' == cmd.action)
            .do(cmd => console.log('Received SUPER SPECIAL SAVE command: ', cmd))
            .subscribe(() => this.modeler.saveXML((err: any, xml: any) => console.log('xml!?!', err, xml))) ;

        this.store.listDiagrams()
            .do(links => this.urls = links)
            // .do(() => console.log('Got links: ', this.urls))
            .flatMap(() => this.store.paletteEntries())
            .do(entries => this.extraPaletteEntries = entries)
            // .do(() => console.log('Got entries: ', this.extraPaletteEntries))
            .subscribe(() => this.createModeler());

    }

    private shrinkToOneColumn = (palette: JQuery) => {
        palette.removeClass('two-column');
        palette.find('.fa-square').removeClass('fa-square').addClass('fa-th-large');
    }

    private expandToTwoColumns(palette: JQuery) {
        palette.addClass('two-column');
        palette.find('.fa-th-large').removeClass('fa-th-large').addClass('fa-square');
    }

    private createModeler() {
        // console.log('Creating modeler, injecting extraPaletteEntries: ', this.extraPaletteEntries);
        this.modeler = new modeler({
            container: containerRef,
            propertiesPanel: {
                parent: propsPanelRef
            },
            additionalModules: [
                { extraPaletteEntries: ['type', () => this.extraPaletteEntries] },
                { commandQueue: ['type', () => this.commandQueue] },
                propertiesPanelModule,
                propertiesProviderModule,
                customPropertiesProviderModule,
                customPaletteModule
            ],
            moddleExtensions: {
                ne: CustomModdle
            },
        });

        // Start with an empty diagram:
        this.url = this.urls[0].href;
        this.loadBPMN();
    }

    private loadBPMN() {
        // console.log('load', this.url, this.store);
        const canvas = this.modeler.get('canvas');
        this.http.get(this.url)
            .map(response => response.text())
            .map(data => this.modeler.importXML(data, this.handleError))
            .subscribe(x => x ? this.handleError(x) : this.postLoad())
            ;
    }

    private postLoad() {
        const canvas = this.modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    private handleError(err: any) {
        if (err) {
            console.log('error rendering', err);
        }
    }

}
