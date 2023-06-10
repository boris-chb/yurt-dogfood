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
