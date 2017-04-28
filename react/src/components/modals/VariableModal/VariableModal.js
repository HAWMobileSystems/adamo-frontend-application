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
import s from './VariableModal.css';

class VariableModal extends React.Component {

  //  <!-- The Modal -- Used for specifing Values -->*
  render() {
    return (
      <div id="VariableModal" class="modal">
        {/*<!-- Modal content  Header-->*/}
        <div class="modal-content-variables">
          <div class="modal-header">
            <span class="close" id="VariableClose">&times;</span>
            <h2>IPIM Variables</h2>
          </div>
          <div class="modal-body modal-body-scroll">
            <p>Please specify the Variables used:</p>
            <form>
              {/*<!-- Fieldset, later on the inputs are dynamicaly created see script part-->*/}
              <fieldset id="variablefset" />
            </form>
          </div>
          <div class="modal-footer">
            <div style="float: left; width: 5vw">
              <input type="button" value=" Add Variable " id="IPIMButtonAddVariable" />
            </div>
            <input type="button" value=" Set " id="VariableModalButton" />
          </div>
        </div>

      </div>
    );
  }
}

export default withStyles(s)(Bpmnio);
