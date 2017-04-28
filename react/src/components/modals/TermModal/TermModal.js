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
import s from './TermModal.css';

class TermModal extends React.Component {

  render() {
    return (
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" id="TermClose">&times;</span>
          <h2>IPIM Terms</h2>
        </div>
        <div class="modal-body">
          <p>Please insert new Term for all Elements:</p>
          <form>
            {/*<!-- <input type="text" value="" id="inputFieldTerm" style="min-width: 100%">  -->*/}
            {/*<IntSysTextarea  name =  />*/}
            <textarea value="" id="inputFieldTerm" class="maxwid" />
          </form>
        </div>
        <div class="modal-footer">
          <input type="button" value=" Set Term " id="SetTermModal" />
        </div>
      </div>
    );
  }
}

export default (TermModal);

// export default withStyles(s)(TermModal);
