export function PaletteProvider(
    palette: any, create: any, elementFactory: any, spaceTool: any, lassoTool: any, handTool: any, globalConnect: any, extraPaletteEntries: any, commandQueue: any) {
    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
    this._extraPaletteEntries = extraPaletteEntries;
    this._commandQueue = commandQueue;
    palette.registerProvider(this);
}
PaletteProvider['$inject'] = ['palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool', 'handTool', 'globalConnect', 'extraPaletteEntries', 'commandQueue'];

PaletteProvider.prototype.getPaletteEntries = function (element: any) {
    const self = this;

    const actions = {};
    const create = this._create;
    const elementFactory = this._elementFactory;
    const spaceTool = this._spaceTool;
    const lassoTool = this._lassoTool;
    const handTool = this._handTool;
    const extraPaletteEntries = this._extraPaletteEntries;
    const globalConnect = this._globalConnect;
    const commandQueue = this._commandQueue;

    console.log('Palette-provider: extraPaletteEntries=', extraPaletteEntries);

    function createAction(type: string, group: string, className: string, title: string = null, options: any = {}) {
        function createListener(event: any) {
            const shape = elementFactory.createShape(Object.assign({type: type}, options));
            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(event, shape);
        }

        return {
            group: group,
            className: className,
            title: title || 'Create ' + type.replace(/^bpmn\:/, ''),
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    function createParticipant(event: any, collapsed: any) {
        create.start(event, elementFactory.createParticipantShape(collapsed));
    }
// need to insert column here!
    for( let entry in extraPaletteEntries) {
        extraPaletteEntries[entry].action.click = () => {
            console.log('Sending command: ', entry);
            commandQueue.next({action: entry});
        };
    }

    Object.assign(actions, extraPaletteEntries);
    Object.assign(actions, {
        'tool-separator-row': {
            group: 'row',
            separator: true
        },
        save: {
            group: 'storage',
            className: ['fa-arrow-circle-down', 'fas'],
            title: 'Export to BPMN',
            action: {
                click: () => commandQueue.next({action: 'save'})
            }
        },
        'export-svg': {
            group: 'storage',
            className: ['fas-download', 'fa'],
            title: 'Export to SVG',
            action: {
                click: () => commandQueue.next({action: 'Export SVG'})
            }
        },
        'upload-engine': {
            group: 'storage',
            className: ['fa-copy', 'fas'],
            title: 'Export to Engine',
            action: {
                click: () => commandQueue.next({action: 'Export to Engine'})
            }
        },
        'tool-separator-storage': {
            group: 'storage',
            separator: true
        },
        'view.zoom-to-fit': {
            group: 'view',
            className: ['fa-fullscreen', 'fas'],
            title: 'Zoom-To-Fit',
            action: {
                click: () => commandQueue.next({action: 'zoom2fit'})
            }
        },
        'view.tool-separator-view': {
            group: 'view',
            separator: true
        },
        'hand-tool': {
            group: 'advanced',
            className: 'bpmn-icon-hand-tool',
            title: 'Activate the hand tool',
            action: {
              click: (event: any) => {
                handTool.activateHand(event);
              }
            }
        },
        'lasso-tool': {
            group: 'advanced',
            className: 'bpmn-icon-lasso-tool',
            title: 'Activate the lasso tool',
            action: {
                click: (event: any) => {
                    lassoTool.activateSelection(event);
                }
            }
        },
        'space-tool': {
            group: 'advanced',
            className: 'bpmn-icon-space-tool',
            title: 'Activate the create/remove space tool',
            action: {
                click: (event: any) => {
                    spaceTool.activateSelection(event);
                }
            }
        },
        'global-connect-tool': {
            group: 'advanced',
            className: 'bpmn-icon-connection-multi',
            title: 'Activate the global connect tool',
            action: {
              click: (event: any) => {
                globalConnect.toggle(event);
              }
            }
        },
        'create.start-event': createAction(
            'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
        ),
        'create.intermediate-event': createAction(
            'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
        ),
        'create.end-event': createAction(
            'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
        ),
        'create.exclusive-gateway': createAction(
            'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none'
        ),
        'create.task': createAction(
            'bpmn:Task', 'activity', 'bpmn-icon-task'
        ),
        'create.data-object': createAction(
            'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object'
        ),
        'create.data-store': createAction(
            'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store'
        ),
        'tool-separator-event': {
            group: 'event',
            separator: true
        },
        'create.gateway-none': createAction(
            'bpmn:Gateway', 'gateway', 'bpmn-icon-gateway-none'
        ),
        'tool-separator-gateway': {
            group: 'gateway',
            separator: true
        },
        'create.user-task': createAction(
            'bpmn:UserTask', 'activity', 'bpmn-icon-user-task', 'UserTask'
        ),
        'create.send-task': createAction(
            'bpmn:SendTask', 'activity', 'bpmn-icon-send-task', 'SendTask'
        ),
        'create.script-task': createAction(
            'bpmn:ScriptTask', 'activity', 'bpmn-icon-service-task', 'ScriptTask'
        ),
        'tool-separator-activity': {
            group: 'advanced',
            separator: true
        },
        'create.subprocess-expanded': createAction(
            'bpmn:SubProcess', 'advanced', 'bpmn-icon-subprocess-expanded', 'Create expanded SubProcess',
            {isExpanded: true}
        ),
        'create.subprocess-collapsed': createAction(
            'bpmn:SubProcess', 'advanced', 'bpmn-icon-subprocess-collapsed', 'Create collapsed SubProcess',
            {isExpanded: false}
        ),
        'create.participant-expanded': {
            group: 'advanced',
            className: 'bpmn-icon-participant',
            title: 'Create Pool/Participant',
            action: {
                dragstart: createParticipant,
                click: createParticipant
            }
        }
    });

    console.log('actions now: ', actions);

    return actions;
};