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

let q = {
  get currentQuestion() {
    const currentQ = shadowDOMSearch(
      'yurt-core-label-questionnaire-question-type-mapper'
    )?.[0]?.currentQuestions;

    if (currentQ && currentQ.length > 1) {
      console.log('SUBQUESTIONS');
      return currentQ;
    }

    return currentQ[0];
  },
  get questionnaire() {
    const q = shadowDOMSearch('yurt-core-questionnaire')?.[0];

    return q;
  },

  get questionnaireMapper() {
    let qMapper = shadowDOMSearch(
      'yurt-core-label-questionnaire-question-type-mapper'
    )?.[0];

    return qMapper;
  },
};

// q1
let q1 = {
  id: 'violent_extremism/question/video_3065_tvc/applicable_ve_actor',
  version: '540215373',
  questionType: 'QUESTION_TYPE_MULTI_DROPDOWN_SEARCHABLE',
  label: 'Select applicable VE Actor',
  defaultNextQuestionId: 'violent_extremism/question/video_3065_tvc/act_type',
};

let q2 = [
  {
    id: 'violent_extremism/question/video_3065_tvc/act_type',
    version: '540215373',
    questionType: 'QUESTION_TYPE_SINGLE_DROPDOWN',
    label: 'Select the act type?',
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/violation_reason',
  },
];

let q3 = [
  {
    id: 'violent_extremism/question/video_3065_tvc/violation_reason',
    version: '540215373',
    questionType: 'QUESTION_TYPE_RADIO',
    label: 'Why is this video violative?',
    answers: [
      {
        id: 'produced_content',
        label: 'Produced Content',
        value: {},
      },
      {
        id: 'depictive_content',
        label: 'Depictive Content',
        value: {},
      },
      {
        id: 'bystander_footage',
        label: 'Bystander Footage',
        value: {},
      },
      {
        id: 'perpetrator_filmed_violence',
        label: 'Perpetrator Filmed Violence',
        value: {},
      },
      {
        id: 'violent_attacker_manifesto',
        label: 'Violent Attacker Manifesto',
        value: {},
      },
      {
        id: 'other',
        label: 'Other',
        value: {},
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/abuse_location',
  },
];

let q4 = [
  {
    id: 'violent_extremism/question/video_3065_tvc/abuse_location',
    version: '540215373',
    questionType: 'QUESTION_TYPE_CHECKBOX',
    label: 'Label the location of abuse (modality)',
    answers: [
      {
        id: 'video',
        label: 'Video: Relevant',
        value: {},
      },
      {
        id: 'video_not_relevant',
        label: 'Video: Not Relevant',
        value: {},
      },
      {
        id: 'abusive',
        label: 'Video: Abusive',
        value: {},
      },
      {
        id: 'video_not_reviewed',
        label: 'Video: Not Reviewed',
        value: {},
      },
      {
        id: 'audio_relevant',
        label: 'Audio: Relevant',
        value: {},
      },
      {
        id: 'audio_not_relevant',
        label: 'Audio: Not Relevant',
        value: {},
      },
      {
        id: 'audio_abusive',
        label: 'Audio: Abusive',
        value: {},
      },
      {
        id: 'audio_not_reviewed',
        label: 'Audio: Not Reviewed',
        value: {},
      },
      {
        id: 'metadata_relevant',
        label: 'Metadata: Relevant',
        value: {},
      },
      {
        id: 'metadata_not_relevant',
        label: 'Metadata: Not Relevant',
        value: {},
      },
      {
        id: 'metadata_abusive',
        label: 'Metadata: Abusive',
        value: {},
      },
      {
        id: 'metadata_not_reviewed',
        label: 'Metadata: Not Reviewed',
        value: {},
      },
    ],
    edges: [
      {
        nextQuestionId:
          'violent_extremism/question/video_3065_tvc/metadata_features',
        triggers: [
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:metadata_relevant',
            ],
          },
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:metadata_abusive',
            ],
          },
        ],
      },
      {
        nextQuestionId:
          'violent_extremism/question/video_3065_tvc/video_features',
        triggers: [
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:video',
            ],
          },
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:abusive',
            ],
          },
        ],
      },
      {
        nextQuestionId:
          'violent_extremism/question/video_3065_tvc/audio_features',
        triggers: [
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:audio_relevant',
            ],
          },
          {
            answerIds: [
              'violent_extremism/question/video_3065_tvc/abuse_location:audio_abusive',
            ],
          },
        ],
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/confidence_level',
  },
];

let q5VideoFeatures = [
  {
    id: 'violent_extremism/question/video_3065_tvc/video_features',
    version: '540215373',
    questionType: 'QUESTION_TYPE_CHECKBOX',
    label: 'What are the video features?',
    answers: [
      {
        id: 'featured_person',
        label: 'Featured person',
        value: {},
      },
      {
        id: 've_logo',
        label: 'Logo of VE actor',
        value: {},
      },
      {
        id: 'text_in_video',
        label: 'Text burned in video',
        value: {},
      },
      {
        id: 'link_in_video',
        label: 'Link burned in video',
        value: {},
      },
      {
        id: 'none',
        label: 'None',
        value: {},
      },
      {
        id: 'other',
        label: 'Other',
        value: {},
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/video_type',
  },
];

let q5AudioFeatures = [
  {
    id: 'violent_extremism/question/video_3065_tvc/audio_features',
    version: '540215373',
    questionType: 'QUESTION_TYPE_RADIO',
    label: 'What are the audio features?',
    answers: [
      {
        id: 'song',
        label: 'Song',
        value: {},
      },
      {
        id: 'speech',
        label: 'Speech',
        value: {},
      },
      {
        id: 'other',
        label: 'Other',
        value: {},
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/audio_segment',
  },
];

let q6VideoType = [
  {
    id: 'violent_extremism/question/video_3065_tvc/video_type',
    version: '540215373',
    questionType: 'QUESTION_TYPE_SINGLE_DROPDOWN',
    label: 'What is the video type?',
    answers: [
      {
        id: 'single_take',
        label: 'Single take / no changes of scene',
        value: {},
      },
      {
        id: 'compilation',
        label: 'Compliation of videos',
        value: {},
      },
      {
        id: 'slideshow',
        label: 'Slideshow of static images',
        value: {},
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/video_contents',
  },
];

let q7VideoContents = [
  {
    id: 'violent_extremism/question/video_3065_tvc/video_contents',
    version: '540215373',
    questionType: 'QUESTION_TYPE_CHECKBOX',
    label: 'What are the video contents?',
    answers: [
      {
        id: 'executions',
        label: 'Executions/Torture',
        value: {},
      },
      {
        id: 'explosions',
        label: 'Bombings/Explosions',
        value: {},
      },
      {
        id: 'shooting',
        label: 'Sniper footage/shooting',
        value: {},
      },
      {
        id: 'parade',
        label: 'Parade',
        value: {},
      },
      {
        id: 'gaming',
        label: 'Gaming',
        value: {},
      },
      {
        id: 'speech',
        label: 'Speech',
        value: {},
      },
      {
        id: 'other',
        label: 'Other',
        value: {},
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/visual_segment',
  },
];

let timestampQ = [
  {
    id: 'violent_extremism/question/video_3065_tvc/visual_segment',
    version: '540215373',
    questionType: 'QUESTION_TYPE_TIME_INTERVAL_ANNOTATION',
    label: 'Please mark the start and end time of the visual abuse segment',
    answers: [
      {
        id: 'time_interval',
      },
    ],
    defaultNextQuestionId:
      'violent_extremism/question/video_3065_tvc/confidence_level',
  },
];

let confidenceLevel = {
  id: 'violent_extremism/question/video_3065_tvc/confidence_level',
  version: '540215373',
  questionType: 'QUESTION_TYPE_SINGLE_DROPDOWN',
  label: 'Select the level of confidence in your answer',
  answers: [
    {
      id: 'very_confident',
      label: 'Very confident',
      value: {},
    },
    {
      id: 'somewhat_confident',
      label: 'Somewhat confident',
      value: {},
    },
    {
      id: 'not_confident',
      label: 'Not confident',
      value: {},
    },
  ],
};

function answerQuestion(question, answers) {
  const {
    abuse_location,
    applicable_ve_group,
    act_type,
    audio_features,
    video_features,
    video_contents,
    video_type,
    audio_segment,
    video_segment,
    confidence_level,
  } = answers;

  const {
    click: { checklist, listItem, checkbox, element: clickElement },
    clickDone,
    clickNext,
  } = $utils;

  // questionId is always last
  let lastElementIndex = question.id.split('/').length - 1;
  let questionId = question.id.split('/')[lastElementIndex];

  console.log(`[❔] Answering ${questionId}.`);

  // Video Strike
  if (questionId === 'abuse_location') {
    listItem(abuse_location.listItem);
    checklist(abuse_location.checklist);
  } else if (
    ['applicable_ve_group', 'applicable_ve_actor'].includes(questionId)
  ) {
    listItem(applicable_ve_group);
  } else if (questionId === 'act_type') {
    listItem(act_type);
  } else if (questionId === 'video_features') {
    video_features.forEach((arg) => checkbox(arg));
  } else if (questionId === 'audio_features') {
    listItem(audio_features);
  } else if (questionId === 'video_contents') {
    video_contents.forEach((arg) => checkbox(arg));
  } else if (questionId === 'video_type') {
    listItem(video_type);
  } else if (questionId === 'borderline_video/borderline_decision') {
    listItem();
  } else if (
    (questionId === 'video_segment' || questionId === 'audio_segment') &&
    (audio_segment || video_segment)
  ) {
    clickElement('tcs-button', {
      'data-test-id': 'label-questionnaire-time-annotation-button',
    });

    clickElement('tcs-button', {
      'data-test-id': 'label-questionnaire-time-annotation-button',
    });
  } else if (questionId === 'confidence_level') {
    listItem(confidence_level);
  }

  // Click Next after answering each question, just to be sure
  clickNext();

  console.log(`[✅] Question Answered: ${questionId}`);
  if (question.deferTraversal) {
    clickDone();
    clearInterval($timers.STRIKE_ID);
    console.log('[✅] Questionnaire Submitted');
    // render notes recommendations for strike with chosen policy id

    const chosenPolicyId = shadowDOMSearch('yurt-core-questionnaire')?.[0]
      ?.policy?.id;

    setTimeout(() => $utils.expandNotesArea(), 1);

    // SHOW STRIKE RECOMMENDATIONS
    $ui.components
      .recommendationPanel({
        notesArr: recommendationNotes.strike[chosenPolicyId],
      })
      .render();
  }
}
