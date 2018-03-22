import { Inherits } from 'inherits';
const commandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
const mqtt = require('mqtt');

export class CommandStack {
    private modeler : any;
    private COMMANDSTACK : string = 'commandStack';
    private EVENTBUS : string = 'eventBus';
    private commandStack : any;
    private client: any;
    private id: any;
    private stacksize: any;

    constructor(modeler : any) {
        this.modeler = modeler;
        this.commandStack = this.modeler.get(this.COMMANDSTACK);
        const tempmodeler = this.modeler;
        const cs = this.commandStack;
        //this.commandLogger(this.modeler.get(this.EVENTBUS));
        this.id = this.guidGenerator();
        const tempid = this.id;
        this.stacksize = -1;
        let tempstacksize = this.stacksize;
        this.client  = mqtt.connect('mqtt://localhost:4711');  //  mqtt://test.mosquitto.org
        this.client.subscribe('IPIM');
        const tempclient = this.client;
        this.client.on('message', function(topic: any, message: any) {
            //console.log('Test from remote:' + message.toString());

            // tempmodeler.importXML(message.toString(), (err: any) => {
            //     console.log(err);
            // });
            const event = JSON.parse(message);
            console.log(event);
            if (event.IPIMID !== tempid)  {
                console.log('executing command internal!');
                debugger;
                const tempsize = cs._stackIdx;
                for (let i = 0; i < event.stack.length; i++) {
                    cs._internalExecute(event.stack[i], false);
                }
                cs._stackIdx = tempsize;
            }
          });
        console.log('Client publishing.. ');
        this.modeler.on('commandStack.changed', () => {
            // user modeled something or
            // performed a undo/redo operation
            // tempmodeler.saveXML({ format: true }, (err: any, xml: any) => {
            //     //       console.log('xml:', xml, 'err', err);
            //            tempclient.publish('IPIM', xml);
            //        });
            const transfer: any = {
                stack: [],
                IPIMID: tempid
            };
            while (cs._stack.length - 1 > tempstacksize) {
                tempstacksize = tempstacksize + 1;
                transfer.stack.push(cs._stack[tempstacksize]);
            }
            debugger;
            tempclient.publish('IPIM', JSON.stringify(transfer));
          });

    }

    public commandTest = () => {
        const testTerm = this.commandStack._stack[0];
        this.commandStack.execute(testTerm.command, testTerm.context);
      }

    public commandLogger = (eventBus: any) => {
       //Call Constructor for CommandInterceptor, Call function gets the Object itself and the required eventbus
       commandInterceptor.call(commandInterceptor, eventBus);

       //Small trick to get the jquery class working with angular. Prototype functions are added as direct variable...
       commandInterceptor.postExecuted = commandInterceptor.prototype.postExecuted;
       commandInterceptor.postExecute = commandInterceptor.prototype.postExecute;
       commandInterceptor.execute = commandInterceptor.prototype.execute;
       commandInterceptor.executed = commandInterceptor.prototype.executed;
       commandInterceptor.on = commandInterceptor.prototype.on;

       //finally implement the hook and be happy!
       commandInterceptor.prototype.postExecute.call(commandInterceptor, ( event : any ) =>  {
            if (typeof event.context.IPIMremote === 'undefined') { //&& event.command === 'shape.create') {  //lane.updateRefs
                event.context.IPIMremote = 'yes';
                event.context.IPIMID = this.id;
                console.log('IPIM command execute logger', event, this.commandStack);

            //     this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
            //  //       console.log('xml:', xml, 'err', err);
            //         this.client.publish('IPIM', xml);
            //     });
                //console.log(this.modeler.saveXML());
                this.client.publish('IPIM', JSON.stringify(event));
                //this.client.publish('IPIM', this.modeler.saveXML());
          }
        });
    }

    public  guidGenerator() {
        const S4 = () => {
           return (((1 + Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
}