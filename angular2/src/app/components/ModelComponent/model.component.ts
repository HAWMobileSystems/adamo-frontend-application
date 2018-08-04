import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';

const mqtt = require('mqtt');

@Component({
    selector: 'model-management',
    templateUrl: './model.template.html'
})

export class ModelComponent {
    private selected: any;
    private newModel: any;
    private models: any;
    private mqtt: any;

    constructor(private apiService: ApiService, private alertService: AlertService) {
    }

    public ngOnInit() {
        this.newModel = {
            mid: '',
            modelname: '',
            modelxml: '',
            version: '',
            lastchange: ''
        };

        this.getAllModels();

        this.mqtt = mqtt.connect('mqtt://localhost:4711');
        this.mqtt.subscribe('MODEL');
        const i = this;
        this.mqtt.on('message', function (topic: any, message: any) {
            console.log('Test from remote:' + message.toString());
            i.getAllModels();
        });
    }

    public getAllModels() {
        this.models = [];

        this.apiService.getAllModels()
            .subscribe(response => {
                    if (response.success) {
                        this.models = response.data;
                        this.selected = null;
                    } else {
                        this.alertService.error(response._body);
                    }
                },
                error => {
                    console.log(error);
                    this.alertService.error(JSON.parse(error._body).status);
                });
    }

    public modelUpdate() {
        this.apiService.modelUpdate(
            this.selected.mid,
            this.selected.modelname,
            this.selected.lastchange,
            this.selected.modelxml,
            this.selected.version)
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    } else {
                        this.alertService.error(response._body);
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }

    public modelCreate() {
        this.apiService.modelCreate(this.selected.modelname, this.selected.lastchange, this.selected.modelxml, this.selected.version)
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    } else {
                        this.alertService.error(response._body);
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }

    public modelDelete() {
        this.apiService.modelDelete(this.selected.mid)
            .subscribe(response => {
                    console.log(response);
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    } else {
                        this.alertService.error(response._body);
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }
}
