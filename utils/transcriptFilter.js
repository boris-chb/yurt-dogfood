function filterTranscript() {
  let transcriptPages = [...shadowDOMSearch('.transcript-pages')];

  transcriptPages.forEach((page, i) => {
    let spanArr = [...page.children];
    console.log(spanArr);

    if (spanArr.length === 1) {
      spanArr[0].scrollIntoView();
    }

    setTimeout(() => console.log(spanArr), 500);
  });
}
