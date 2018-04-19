import { Inherits } from 'inherits';
const commandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
const mqtt = require('mqtt');

export class CommandStack {
    private modeler : any;
    private COMMANDSTACK : string = 'commandStack';
    private EVENTBUS : string = 'eventBus';
    private MODELING : string = 'modeling';
    private ELEMENTREGISTRY : string = 'elementRegistry';
    private DRAGGING : string = 'dragging';
    private modeling : any;
    private commandStack : any;
    private eleReg : any;
    private client: any;
    private id: any;
    private dragging : any;

    //Commandstack Class

    constructor(modeler : any) {
        this.modeler = modeler;
        this.commandStack = this.modeler.get(this.COMMANDSTACK);
        this.modeling = this.modeler.get(this.MODELING);
        this.eleReg = this.modeler.get(this.ELEMENTREGISTRY);
        this.dragging = this.modeler.get(this.DRAGGING);
        const tempdragging = this.dragging;
        const tempmodeler = this.modeler;
        //this.commandLogger(this.modeler.get(this.EVENTBUS));
        this.client  = mqtt.connect('mqtt://localhost:4711');  //  mqtt://test.mosquitto.org
        this.client.subscribe('IPIM');
        const tempclient = this.client;
        this.id = this.guidGenerator();
        const tempid = this.id;
        this.client.on('message', (topic: any, message: any) => {

            const event = JSON.parse(message);

            if (event.IPIMID !== this.id){
                console.log('Test from remote:' + message.toString());

                tempdragging.cancel();

                tempmodeler.importXML(event.XMLDoc.toString(), (err: any) => {
                    console.log(err);
                });
            }
            // const event = JSON.parse(message);
            // console.log( event);

            // debugger;
            // if (event.command === 'shape.create') { this.modeling._create('shape', event.context.shape); }
            // if (event.command === 'shape.append') { this.modeling._create('shape.append', event.context.shape); }

            // this.commandStack.execute(event.command, event.context);
          });
        console.log('Client publishing.. ');
        tempmodeler.on('element.changed', function() {
            // user modeled something or
            // performed a undo/redo operation
            tempmodeler.saveXML({ format: true }, (err: any, xml: any) => {
                //       console.log('xml:', xml, 'err', err);
                       const transfer: any = {
                            IPIMID: tempid,
                            XMLDoc: xml

                       };
                       tempclient.publish('IPIM', JSON.stringify(transfer));
            });
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
       commandInterceptor.executed = commandInterceptor.prototype.executed;
       commandInterceptor.execute = commandInterceptor.prototype.execute;
       commandInterceptor.on = commandInterceptor.prototype.on;

       //finally implement the hook and be happy!
       commandInterceptor.prototype.executed.call(commandInterceptor, ( event : any ) =>  {
            if (typeof event.context.IPIMremote === 'undefined') { //&& event.command === 'shape.create') {  //lane.updateRefs
            debugger;
            event.context.IPIMremote = 'yes';
                console.log('IPIM command execute logger', event);

                // this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
                //     this.client.publish('IPIM', xml);
                // });
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
        return (S4() + S4() + "-" + S4() +"-"+ S4() +"-"+ S4() +"-"+ S4() + S4() + S4() );
    }
}