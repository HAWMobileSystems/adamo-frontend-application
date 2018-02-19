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
          debugger;
       //   const commandInterceptor : any = new CommandInterceptor();
       commandInterceptor.call(commandInterceptor, eventBus);
       // where belongs preexecute
       // how to instantiate commandInterceptor corretly

       // direct ... works but has no eventBus variable from call above
       //commandInterceptor.prototpye.preExecute( ( event : any ) =>  {
       // console.log('command pre-execute', event);
       // });

       //indirect call has the variable from above but is unable to call the .on function as it expects prototype.on ...
       //commandInterceptor.prototype.preExecute.call(commandInterceptor, ( event : any ) =>  {
       //  console.log('command pre-execute', event);
       // });
     }
}