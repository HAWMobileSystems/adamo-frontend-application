/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Bpmnio.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import TermModal from './../modals/TermModal';

import InputModal from './../modals/InputModal';

import VariableModal from './../modals/VariableModal';

import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';


class Bpmnio extends React.Component {
  _initBPMNIO() {
    return bpmnModeler = new BpmnModeler({
      container: canvas,
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
  }
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className="content" id="js-drop-zone">

            <div className="message intro">
              <div className="note">
                Drop BPMN diagram from your desktop or <a id="js-create-diagram" href>create a new diagram</a> to get started.
                </div>
            </div>

            <div class="message error">
              <div class="note">
                <p>Ooops, we could not display the BPMN 2.0 diagram.</p>

                <div class="details">
                  <span>cause of the problem</span>
                  <pre></pre>
                </div>
              </div>
            </div>

            <div class="canvas" id="js-canvas"></div>
            <div id="js-properties-panel"></div>
          </div>

          <ul class="buttons">
            <li>
              <a id="js-download-diagram" href title="download BPMN diagram">
                BPMN diagram
                </a>
            </li>
            <li>
              <a id="js-download-svg" href title="download as SVG image">
                SVG image
                </a>
            </li>
            <li>
              <a class="" id="IPIM-Load" href title="Open BPMN File">
                Load diagram
                </a>
            </li>
          </ul>



          {/*<!-- CHANGEMS Steuerelemente für IPIM Logik -->
            <!--
            <a     style="position:absolute; top:2%; left:5%; font-size:160%;"> IPIM Values </a>
            <a     style="position:absolute; top:2%; left:14%; font-size:160%; "> A= </a>
            <input style="position:absolute; top:2%; left:16%; width:5%;" type="text" id="IPIMuserInputA" />
            <a     style="position:absolute; top:2%; left:22%; font-size:160%;"> B= </a>
            <input style="position:absolute; top:2%; left:24%; width:5%;" type="text" id="IPIMuserInputB" />
            <a     style="position:absolute; top:2%; left:30%; font-size:160%;"> C= </a>
            <input style="position:absolute; top:2%; left:32%; width:5%;" type="text" id="IPIMuserInputC" />
          -->

            <!--  <input style="position:absolute; top:2%; left:5%; width:7%;" type="button" value="Evaluate" id="IPIMButtonEval" >
          -->*/}
          <input style="position:absolute; top:2%; left:12%; width:5%; display: none;" type="button" value="Reset" id="IPIMButtonReset" />
          <input style="position:absolute; top:2%; left:18%; width:8%; display: none;" type="button" value="SetValues" id="IPIMButtonEval2" />
          <input style="position:absolute; top:2%; left:28%; width:8%; display: none;" type="button" value="Open File" id="OpenFile" />
          <input style="position:absolute; top:2%; left:28%; display: none;" type="file" id="files" name="files[]" />
          <input style="position:absolute; top:2%; left:38%; width:8%; display: none;" type="button" value="Toggle Terms" id="IPIMShowTerms" />
          <input style="position:absolute; top:2%; left:48%; width:8%; display: none;" type="button" value="Set Term" id="IPIMButtonTermSet" />
          <input style="position:absolute; top:2%; left:48%; width:8%; display: none;" type="button" value="Set Variables" id="IPIMButtonVariableSet" />
          <input style="position:absolute; top:2%; left:48%; width:8%; display: none;" type="button" value="ToggleMenu" id="ToggleMenu" />

          {/*<!-- The Modal -- Used for specifing Values -->*/}
          <TermModal />

          {/*<!-- The Modal -- Used for specifing Values -->*/}
          <VariableModal />

          {/*<!-- Modal for adding\ Terms to Objects -->*/}
          <InputModal />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Bpmnio);
