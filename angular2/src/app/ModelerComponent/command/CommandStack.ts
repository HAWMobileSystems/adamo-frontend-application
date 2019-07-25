// import {Inherits} from 'inherits';
import { ModelComponent } from "../../components/ModelComponent/model.component";
import { ModelerComponent } from "../modeler.component";
import { IPIM_OPTIONS } from "../../modelerConfig.service";

import { AdamoMqttService } from "../../services/mqtt.service";
const commandInterceptor = require("diagram-js/lib/command/CommandInterceptor");
import { environment } from "./../../../environments/environment";

export class CommandStack {
  private modeler: any; //Modeler from Main Application
  private COMMANDSTACK: string = "commandStack"; //Commandstack from Modeler ... used for tests
  private EVENTBUS: string = "eventBus"; //Eventbus from Modeler to trigger for element changed Event
  private ELEMENTREGISTRY: string = "elementRegistry"; //ElementRegistry from Modeler for testing purposes
  private DRAGGING: string = "dragging"; //Dragging Class from Modeler, used for aborting possible movement while refreshing
  private mqttString: string =
    environment.SERVER_HOST + ":" + environment.MQTT_PORT; //Connection path for the mqtt Server
  private defaultTopic: string = "IPIM Default"; //Default Topic to subscribe on
  private commandStack: any; //commandStack for testing purposes
  private eleReg: any; //elementRegistry for Testing purposes
  private id: any; //Generated unique ID for Client to avoid Echos
  private dragging: any; //Dragging State from Modeler
  private topic: any; //Currently subscribed Topic
  private modelerComponenetRoot: ModelerComponent;
  private stopEvaluationisRunning: boolean;

  //Commandstack Class

  constructor(
    modeler: any,
    modelerComponenetRoot: ModelerComponent,
    private mqttService: AdamoMqttService
  ) {
    this.modeler = modeler; //take modeler from super function
    this.commandStack = this.modeler.get(this.COMMANDSTACK); //get commandStack from Modeler
    this.eleReg = this.modeler.get(this.ELEMENTREGISTRY); //get ElementRegistry from Modeler
    this.dragging = this.modeler.get(this.DRAGGING); //get Dragging State from Modeler
    this.id = this.guidGenerator(); //generate the unique ID for this Browser
    this.modelerComponenetRoot = modelerComponenetRoot;
    // this.topic = this.modelerComponenetRoot.modelId;
    this.topic =
      "" +
      "model_" +
      this.modelerComponenetRoot.model.id +
      "_" +
      this.modelerComponenetRoot.model.version;
    this.stopEvaluationisRunning = false;

    this.mqttService.getClient().subscribe("MODEL/" + this.topic); //subscribe Client to defaulttopic on MQTT Server
    this.mqttService.getClient().subscribe("modelupsert");

    //Register Event to trigger when a new Message is received ... triggers only if topic is subscribed!
    this.mqttService.getClient().on("message", (topic: any, message: any) => {
      //call function to handle the new message
      this.receiveMessage(topic, message);
    });

    //Call Publish function if something changes here we use the Eventbus Event element changed!
    this.modeler.on("elements.changed", this.publishXML);
  }

  //Starts Evaluation Mode ... Model will unsubscribe and no longer publish!
  public startEvaluateMode = () => {
    this.stopEvaluationisRunning = true;
    // this.mqttService.getClient().unsubscribe('MODEL/' + this.topic);
  };

  //Stop Evaluation Mode ... Model will resubscribe and publish again!
  public stopEvaluateMode = () => {
    this.stopEvaluationisRunning = false;
    // this.mqttService.getClient().subscribe('MODEL/' + this.topic);
  };

  //Handle a new Message from MQTT-Server
  public receiveMessage = (topic: any, message: any) => {
    console.log(topic);
    const event = JSON.parse(message);
    if (topic.startsWith("MODEL/")) {
      //Parse event from String to variable

      //check if the Event was issued from remote or self
      if (event.IPIMID !== this.id && "MODEL/" + this.topic === topic) {
        if (this.stopEvaluationisRunning) {
          return;
        }
        //event was remote so cancel dragging if active an import new XML String
        console.log("Test from remote:" + message.toString());

        this.dragging.cancel();

        this.modeler.importXML(event.XMLDoc.toString(), (err: any) => {
          console.log(err);
        });
      }
    } else if (topic === "modelupsert") {
      const model = this.modelerComponenetRoot.model;
      if (model.id === event.mid && model.version === event.version) {
        model.version = event.newVersion;
        this.mqttService
          .getClient()
          .unsubscribe("MODEL/model_" + event.mid + "_" + event.version);
        this.mqttService
          .getClient()
          .subscribe("MODEL/model_" + event.mid + "_" + event.newVersion);
        this.topic = "model_" + event.mid + "_" + event.newVersion;
      }
    }
  };

  //Publish the current Model as XML to the MQTT Server ... automatically called on element.changed
  public publishXML = (): void => {
    //If

    if (this.stopEvaluationisRunning) {
      return;
    }
    // user modeled something or
    // performed a undo/redo operation
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      if (err) {
        console.log(err);
        return;
      }
      const transfer: any = {
        IPIMID: this.id,
        XMLDoc: xml
      };
      this.mqttService
        .getClient()
        .publish("MODEL/" + this.topic, JSON.stringify(transfer));
    });
  };

  //Testfunction for evaluating the CommandStack
  public commandTest = () => {
    const testTerm = this.commandStack._stack[0];
    this.commandStack.execute(testTerm.command, testTerm.context);
  };

  public commandLogger = (eventBus: any) => {
    //Call Constructor for CommandInterceptor, Call function gets the Object itself and the required eventbus
    commandInterceptor.call(commandInterceptor, eventBus);

    //Small trick to get the jquery class working with angular. Prototype functions are added as direct variable...
    commandInterceptor.postExecuted = commandInterceptor.prototype.postExecuted;
    commandInterceptor.executed = commandInterceptor.prototype.executed;
    commandInterceptor.execute = commandInterceptor.prototype.execute;
    commandInterceptor.on = commandInterceptor.prototype.on;

    //finally implement the hook and be happy!
    commandInterceptor.prototype.executed.call(
      commandInterceptor,
      (event: any) => {
        if (typeof event.context.IPIMremote === "undefined") {
          //&& event.command === 'shape.create') {  //lane.updateRefs
          event.context.IPIMremote = "yes";

          this.mqttService.getClient().publish("IPIM", JSON.stringify(event));
        }
      }
    );
  };

  //Creates a unique GUI for each Client to eliminate echos
  public guidGenerator(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }
}
