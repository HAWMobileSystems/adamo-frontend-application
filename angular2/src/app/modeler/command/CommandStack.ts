import { Inherits } from 'inherits';
const commandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
const mqtt = require('mqtt');

export class CommandStack {
    private modeler : any;
    private COMMANDSTACK : string = 'commandStack';
    private EVENTBUS : string = 'eventBus';
    private commandStack : any;
    private client: any;

    constructor(modeler : any) {
        this.modeler = modeler;
        this.commandStack = this.modeler.get(this.COMMANDSTACK);
        this.commandLogger(this.modeler.get(this.EVENTBUS));
        this.client  = mqtt.connect('mqtt://test.mosquitto.org');  //  mqtt://localhost:1883
        this.client.subscribe('IPIM');
        console.log('Client publishing.. ');
    }

    public commandTest = () => {
        const testTerm = this.commandStack._stack[0];
        this.commandStack.execute(testTerm.command, testTerm.context);
      }

      public commandLogger = (eventBus: any) => {
       //Call Constructor for CommandInterceptor, Call function gets the Object itself and the required eventbus
       commandInterceptor.call(commandInterceptor, eventBus);

       //Small trick to get the jquery class working with angular. Prototype functions are added as direct variable...
       commandInterceptor.preExecute = commandInterceptor.prototype.preExecute;
       commandInterceptor.execute = commandInterceptor.prototype.execute;
       commandInterceptor.on = commandInterceptor.prototype.on;

       //finally implement the hook and be happy!
       commandInterceptor.prototype.execute.call(commandInterceptor, ( event : any ) =>  {
           event.context.IPIMremote = 'yes';
           console.log('IPIM command execute logger', event);
           //TODO Send to MQTT
           this.client.publish('IPIM', 'Just some text!');
        });
     }
}