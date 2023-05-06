let targetNode = shadowDOMSearch('.filter-controls-on')[0];
let parentNode = targetNode.parentNode;

// create a flexbox container with a switch inside
let newNode =
  strToNode(`<tcs-view padding="small" fillwidth="" display="flex" spec="row" wrap="nowrap" align="stretch" spacing="none"><mwc-formfield>
            <mwc-switch class="include-timestamp" id="timestamp-switch"></mwc-switch>
          </mwc-formfield><tcs-text text="Include timestamp" class="wellness-label" spec="body" texttype="default"></tcs-text></tcs-view>`);

parentNode.insertBefore(newNode, targetNode.nextSibling);
