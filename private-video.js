function shadowDOMSearch(query) {
  var myElement;
  function shadowSearch(rootElement, queryselector) {
    if (myElement) {
      return;
    }
    if (
      queryselector &&
      rootElement.querySelectorAll(queryselector) &&
      rootElement.querySelectorAll(queryselector)[0]
    ) {
      myElement = rootElement.querySelectorAll(queryselector);
      return;
    }
    if (rootElement.nextElementSibling) {
      shadowSearch(rootElement.nextElementSibling, queryselector);
    }
    if (rootElement.shadowRoot) {
      shadowSearch(rootElement.shadowRoot, queryselector);
    }
    if (rootElement.childElementCount > 0) {
      shadowSearch(rootElement.children[0], queryselector);
    }
  }
  shadowSearch(document.querySelector('yurt-root-app').shadowRoot, query);
  return myElement;
}

function unPrivate() {
  setTimeout(() => {
    [...shadowDOMSearch('tcs-button[spec=flat-outlined]')].forEach((btn) =>
      btn.click()
    );
  }, 1);

  setTimeout(() => {
    [...shadowDOMSearch('tcs-button[spec=flat-outlined]')].forEach((btn) =>
      btn.click()
    );
  }, 1000);
}
