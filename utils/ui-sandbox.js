let targetNode = shadowDOMSearch('.filter-controls-on')[0];
let parentNode = targetNode.parentNode;

// create a flexbox container with a switch inside
let newNode =
  strToNode(`<tcs-view padding="small" fillwidth="" display="flex" spec="row" wrap="nowrap" align="stretch" spacing="none"><mwc-formfield>
            <mwc-switch class="include-timestamp" id="timestamp-switch"></mwc-switch>
          </mwc-formfield><tcs-text text="Include timestamp" class="wellness-label" spec="body" texttype="default"></tcs-text></tcs-view>`);

let mwcTextarea = `<mwc-textarea id="decision-panel-notes" data-test-id="core-decision-policy-edit-notes" class="section" outlined="" rows="5" label="Notes" value="">
</mwc-textarea>`;

parentNode.insertBefore(newNode, targetNode.nextSibling);
