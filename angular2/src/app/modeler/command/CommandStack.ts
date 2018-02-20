import { Inherits } from 'inherits';
const commandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

export class CommandStack {
    private modeler : any;
    private COMMANDSTACK : string = 'commandStack';
    private EVENTBUS : string = 'eventBus';
    private commandStack : any;

    constructor(modeler : any) {
        this.modeler = modeler;
        this.commandStack = this.modeler.get(this.COMMANDSTACK);
        this.commandLogger(this.modeler.get(this.EVENTBUS));
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
        });
     }
}