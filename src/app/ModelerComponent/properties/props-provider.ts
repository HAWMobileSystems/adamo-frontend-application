import { custom } from './../custom';

const inherits = require('inherits');

const propertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
const processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps');
const eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps');
const linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps');
const documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps');
const idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps');
const nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps');

import { CustomProps } from './props';

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element: any, bpmnFactory: any, elementRegistry: any) {

    const generalGroup = {
        id: 'general',
        label: 'General',
        entries: new Array()
    };

    idProps(generalGroup, element, elementRegistry);
    nameProps(generalGroup, element);
    processProps(generalGroup, element);

    const detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: new Array()
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry);

    const documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: new Array()
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return [
        generalGroup,
        detailsGroup,
        documentationGroup
    ];
}

function createCustomTabGroups(element: any, elementRegistry: any) {

    const theGroup = {
        id: custom.id,
        label: custom.name,
        entries: new Array()
    };

    CustomProps(theGroup, element);

    return [
        theGroup
    ];
}

export function CustomPropertiesProvider(eventBus: any, bpmnFactory: any, elementRegistry: any) {

    propertiesActivator.call(this, eventBus);

    this.getTabs = (element: any) => {

        const generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
        };

        const theTab = {
            id: custom.id,
            label: custom.name,
            groups: createCustomTabGroups(element, elementRegistry)
        };

        return [
            generalTab,
            theTab
        ];
    };
}

inherits(CustomPropertiesProvider, propertiesActivator);
