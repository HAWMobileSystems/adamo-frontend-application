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

class Bpmnio extends React.Component {
  /*<!-- The Modal -- Used for specifing Values -->*/
  render() {
    return (<div id="InputModal" class="modal">
            {/*<!-- Modal content  Header-->*/}
            <div class="modal-content-input">
              <div class="modal-header">
                <span class="close" id="EvalClose">&times;</span>
                <h2>IPIM Evaluation</h2>
              </div>
              <div class="modal-body">
                <p>Please specify the Values used:</p>
                <form>
                  {/*<!-- Fieldset, later on the inputs are dynamicaly created see script part-->*/}
                  <fieldset id="inputfset" />
                </form>
              </div>
              <div class="modal-footer">
                <input type="button" value=" Evaluate " id="EvalModal" />
              </div>
            </div>
          </div>
    );
  }
}

export default withStyles(s)(Bpmnio);
