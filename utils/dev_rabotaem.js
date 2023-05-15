try {
  $utils.clearTimers();
} catch (e) {}

function log(...args) {
  if ($config.showLogs) console.log(`%c${args}`, 'padding-left: 4px');
}

let selectedVEGroup;
let $reviewRoot = shadowDOMSearch('yurt-review-root')?.[0];

let __veGroups = {
  alq: 'al_qaida_aq_including',
  hezbollah: 'hizballah_political_and_militant_organizations',
  isis: 'islamic_state_of_iraq',
  vnsa: 'violent_nonstate_actor',
  ira: 'irish_republican_army',
  lte: 'liberation_tigers_of_tamil',
  hamas: 'harakat_al_muqawamah_al_islamiyyah',
  taliban: 'tehrike_taliban_pakistan_ttp',
  pkk: 'partiya_karkeren_kurdistani_pkk',
  bla: 'baluchistan_liberation_army_bla',
  osama: 'osama_bin_laden',
  wagner: 'wagner_pmc',
  unknown: 'unknown',
  ik: 'imarat_kavkaz_ik_aka',
};

let $config = {
  SU: true,
  USE_KEYPRESS: false,
  COMMENTS_TIMER_MIN: 1,
  CLICK_BUTTON_RETRY: 50,
  CLICK_BUTTON_INTERVAL_MS: 1,
  FUNCTION_CALL_RETRY_MS: 100,
  NOTIFICATION_TIMEOUT_SEC: 10,
  ACTION_PANEL_POSITION: 'decisionTab',
  showLogs: true,
};

let $const = {
  filterKeywords: [
    'чвк',
    'вагнер',
    'пригожин',
    'prigozhin',
    'wagner',
    'pmc',
    'арбалет',
  ],
  frequentlyUsedPolicies: [
    {
      id: '3044',
      description: 'Account solely dedicated to FTO/extremism',
      tags: [
        'FTO',
        'ISIS',
        'Al-Qaeda',
        'recruiting, incitement, fund raising, hostage channel dedicated',
        'professional',
      ],
      policyVertical: 'VIOLENT_EXTREMISM',
      actionCategorySummary: 'ACTION_REMOVE',
    },
    {
      id: '3039',
      description:
        'Known Violent Extremist Organization depicting or promoting violence',
      tags: [
        'FTO',
        'Al-Qaeda',
        'Gang',
        'hostage',
        'promoting',
        'violence',
        'recruitment',
        'soliciting funding',
      ],
      policyVertical: 'VIOLENT_EXTREMISM',
      actionCategorySummary: 'ACTION_REMOVE',
    },
    {
      id: '3065',
      description:
        'Content produced by or glorifying known Violent Extremist Organizations',
      tags: ['ISIS', 'Al-Qaeda', 'gaming', 'song', 'VE group', 'violence'],
      policyVertical: 'VIOLENT_EXTREMISM',
      actionCategorySummary: 'ACTION_REMOVE',
    },
    {
      id: '5013',
      description:
        'Low EDSA incitement to violence, FTO, ultra graphic violence',
      tags: [
        'Low EDSA',
        'four corners',
        'FTO',
        'incitement to violence, ultra graphic violence',
      ],
      policyVertical: 'VIOLENT_EXTREMISM',
      actionCategorySummary: 'ACTION_RESTRICT',
    },
    {
      id: '6120',
      description:
        'Perpetrator-filmed footage where weapons, injured bodies, or violence is in frame or heard in audio uploaded on or after 6/15/2020',
      tags: ['perpetrator-filmed', 'violent extremism', 'weapon'],
      policyVertical: 'VIOLENT_EXTREMISM',
      actionCategorySummary: 'ACTION_REMOVE',
    },
    {
      id: '9008',
      description: 'Approve',
      tags: ['approve'],
      policyVertical: 'APPROVE',
      actionCategorySummary: 'ACTION_APPROVE',
    },
  ],
  strikeAnswers: {
    song: {
      abuse_location: {
        listItem: { value: 'audio' },
        checklist: { value: 'audio_abusive' },
      },
      applicable_ve_group: {
        value: __veGroups.wagner,
      },
      act_type: { value: 'glorification_terrorism' },
      audio_features: { value: 'song' },
      audio_segment: true,
      confidence_level: { value: 'very_confident' },
    },
    speech: {
      abuse_location: {
        listItem: { value: 'audio' },
        checklist: { value: 'audio_abusive' },
      },
      applicable_ve_group: {
        value: __veGroups.wagner,
      },
      act_type: { value: 'glorification_terrorism' },
      audio_features: { value: 'speech' },
      audio_segment: true,
      confidence_level: { value: 'very_confident' },
    },
    video: {
      abuse_location: {
        listItem: { value: 'video' },
        checklist: { value: 'video_abusive' },
      },
      applicable_ve_group: {
        value: __veGroups.wagner,
      },
      act_type: { value: 'glorification_terrorism' },
      video_features: [{ value: 've_logo' }],
      video_type: { value: 'compilation' },
      video_contents: [{ value: 'other' }],
      video_segment: true,
      confidence_level: { value: 'very_confident' },
    },
  },
  is: {
    autosubmit() {
      return shadowDOMSearch('mwc-checkbox[value="autoreload-page"]')?.[0]
        ?.checked;
    },
    readyForSubmit() {
      return shadowDOMSearch('yurt-core-decision-submit-panel')?.[0]
        ?.readyForSubmit;
    },
    queue(qName) {
      return $utils.get.queueInfo()?.queueName?.toLowerCase().includes(qName);
    },
    xsourceQueue() {
      let queueInfo = $utils.get.queueInfo();
      if (!queueInfo) {
        return false;
      }
      return (
        queueInfo?.queueName.toLowerCase().includes('xsource') &&
        queueInfo?.queueName.toLowerCase().includes('ve')
      );
    },
    bluechipQueue() {
      let queueInfo = $utils.get.queueInfo();
      if (!queueInfo) {
        return;
      }
      return $utils.get
        .queueInfo()
        .queueName?.toLowerCase()
        .includes('bluechip');
    },
  },
};

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

function expandAddReview() {
  const policiesWrapper = shadowDOMSearch('.policies-wrapper')?.[0];
  const sidebarBtns = shadowDOMSearch('.action-buttons')?.[0];

  try {
    sidebarBtns.style.paddingBottom = '100px';
    policiesWrapper.style.maxHeight = '550px';
    policiesWrapper.style.height = '550px';
  } catch (e) {
    // console.error('Could not expand add review', e);
  }
}

function strToNode(str) {
  const tmp = document.createElement('div');
  tmp.innerHTML = str;
  if (tmp.childNodes.length < 2) {
    return tmp.childNodes[0];
  }
  return tmp.childNodes;
}

let recommendationNotes = {
  approve: [
    {
      title: 'News',
      value: () => 'No violations\n4C EDSA News report\nApprove\nRussian',
    },
    {
      title: 'Comedic intent',
      value: () => 'Comedic intent\nNo violations\nApprove\nRussian',
    },
    {
      title: 'Gaming',
      value: () => 'Gaming content\nNo violations\nApprove\nRussian',
    },
  ],
  route: {
    arabic: [
      {
        title: 'Nasheed @',
        value: () =>
          `Please check nasheed @${$utils.get.videoTimestamp()}\nRussian part is approve`,
      },
      {
        title: 'Nasheed',
        value: () => `Please check nasheed\nRussian part is approve`,
      },
      {
        title: 'Arabic Part @',
        value: () =>
          `Please check Arabic part @${$utils.get.videoTimestamp()}\nRussian part is approve`,
      },
      {
        title: 'Arabic Part',
        value: () => 'Please check Arabic part\nRussian part is approve',
      },
    ],
    drugs: [
      {
        title: 'Drugs policy @',
        value: () =>
          `please check for drugs policy violations @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Gambling',
        value: () =>
          `please check for gambling policy violations\napprove for VE`,
      },
    ],
    gv: [
      {
        title: 'MOD @',
        value: () =>
          `please check for MOD @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'GV @',
        value: () =>
          `please check for GV @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
    ],
    adult: [
      {
        title: 'Vulgar language @',
        value: () =>
          `please check for excessive use of vulgar language @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Nudity @',
        value: () =>
          `please check for nudity @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Sexual act @',
        value: () =>
          `please check for implied sexual act @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Adult violations @',
        value: () =>
          `please check for adult violations @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
    ],
    spam: [
      {
        title: 'Spam @',
        value: () =>
          `please check for spam @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Spam (link)',
        value: () =>
          `please check for spam (link in comments) \napprove for VE`,
      },
    ],
    hd: [
      {
        title: 'Dangerous Pranks @',
        value: () =>
          `please check for dangerous pranks @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'H&D violation @',
        value: () =>
          `please check for H&D violations @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
    ],
    hate: [
      {
        title: 'Slur @',
        value: () =>
          `please check for slur @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Hate @',
        value: () =>
          `please check for hate policy violations @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: '🇺🇦🐖 Dehumanization @',
        value: () =>
          `please check for Ukrainian pig dehumanization @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: '🇺🇦 Denazification @',
        value: () =>
          `please check for Denazification of Ukraine @${$utils.get.videoTimestamp()}\napprove for VE`,
      },
      {
        title: 'Podolyak',
        value: () =>
          `please check for Yury Podolyak circumvention\napprove for VE`,
      },
    ],
  },
  strike: {
    3065: [
      {
        title: '[3065] Depictive >50%',
        value: () =>
          `${selectedVEGroup} depictive content >50% of video without EDSA or criticism\n3065 Strike\nRussian`,
      },
      {
        title: '[3065] Depictive+Music',
        value: () =>
          `${selectedVEGroup} depictive content with upbeat music without EDSA or criticism\n3065 Strike\nRussian`,
      },
      {
        title: '[3065] Depictive+Music @',
        value: () =>
          `${selectedVEGroup} depictive content with upbeat music @${$utils.get.videoTimestamp()} without EDSA or criticism\n3065 Strike\nRussian`,
      },
      {
        title: '[3065] Song/Nasheed',
        value: () =>
          `${selectedVEGroup} glorifying song without 4C EDSA or criticism\n3065 Strike\nRussian`,
      },
    ],
    3039: [
      {
        title: '[3039] Song @',
        value: () =>
          `${selectedVEGroup} produced song @${$utils.get.videoTimestamp()}\n3039 Strike (not dedicated)\nRussian`,
      },
      {
        title: '[3039] Song',
        value: () =>
          `${selectedVEGroup} produced song\n3039 Strike (not dedicated)\nRussian`,
      },
      {
        title: '[3039] Raw reupload',
        value: () =>
          `${selectedVEGroup} raw re-upload without criticism or 4C EDSA\n3039 Strike (not dedicated)\nRussian`,
      },
      {
        title: '[3039] Glorification',
        value: () =>
          `Glorification of ${selectedVEGroup}\n3039 Strike (not dedicated)\nRussian`,
      },
      {
        title: '[3039] Glorification @',
        value: () =>
          `Glorification of ${selectedVEGroup} @${$utils.get.videoTimestamp()}\n3039 Strike (not dedicated)\nRussian`,
      },
    ],
    3044: [
      {
        title: '[3044] Raw reupload',
        value: () =>
          `${selectedVEGroup} raw re-upload without criticism or 4C EDSA\nChannel dedicated\n• _________\n• _________\n3044 Terminate\nRussian`,
      },
      {
        title: '[3044] Song',
        value: () =>
          `${selectedVEGroup} produced song\nChannel dedicated\n• _________\n• _________\n3044 Terminate\nRussian`,
      },
      {
        title: '[3044] [1] Raw reupload',
        value: () =>
          `${selectedVEGroup} raw re-upload without criticism or 4C EDSA\nChannel dedicated (single video on channel)\n3044 Terminate\nRussian`,
      },

      {
        title: '[3044] [1] Song',
        value: () =>
          `${selectedVEGroup} produced song\nChannel dedicated (single video on channel)\n3044 Terminate\nRussian`,
      },
    ],
  },
};

let $utils = {
  click: {
    element(queryStr, args, retries = $config.CLICK_BUTTON_RETRY) {
      let btn;
      if (queryStr === 'mwc-list-item') {
        // for list-item, convert nodelist to array, then filter based on value
        let btnNodeList = shadowDOMSearch(queryStr);
        let filterKey = Object.keys(args)[0];
        let filterValue = Object.values(args)[0];

        let foundBtn = btnNodeList
          ? Array.from(btnNodeList).find(
              (listItem) => listItem[filterKey] === filterValue
            )
          : undefined;

        log(`[🔍] list-item[${filterKey}=${filterValue}]`);

        btn = foundBtn;
      } else {
        queryStr = args
          ? `${queryStr}[${Object.keys(args)}=${Object.values(args)}]`
          : queryStr;

        btn = shadowDOMSearch(queryStr)?.[0];
      }

      // Try again until the btn renders
      let btnMissingOrDisabled = !btn || btn?.disabled;

      if (btnMissingOrDisabled && retries) {
        // btn not found, try again
        retries--;
        retries % 10 === 0 && log(retries, `[♻] Looking for ${queryStr}`);
        setTimeout(
          () => $utils.click.element(queryStr, null, retries),
          $config.CLICK_BUTTON_INTERVAL_MS
        );
        return;
      }

      if (retries === 0) return;
      if (btn.checked) {
        console.log('CHECKEDDDDDD');
      }

      try {
        btn.click();
      } catch (e) {
        console.error(e);
      }
    },
    listItem(listArgs) {
      // Values: 'video' || 'audio' || 'metadata'
      // STEP: Label the location of abuse (modality)
      $utils.click.element('mwc-list-item', listArgs);
    },
    listItemByInnerText(...args) {
      let listItems = [...shadowDOMSearch('mwc-list-item')];

      let item = listItems.find((el) =>
        args.every((innerText) =>
          el.innerText.toLowerCase()?.includes(innerText.toLowerCase())
        )
      );

      try {
        item?.click();
      } catch (e) {
        log(e.stack);
      }
    },
    checkbox(listArgs) {
      $utils.click.element('mwc-checkbox', listArgs);
    },
    checklist(listArgs) {
      $utils.click.element('mwc-check-list-item', listArgs);
    },
    radio(listArgs) {
      $utils.click.element('mwc-radio', listArgs);
    },
  },
  get: {
    timeElapsed() {
      var timeDiff = Math.round(
        (new Date() - new Date($reviewRoot.allocateStartTime)) / 1000
      );

      if (timeDiff === 300) $utils.sendNotification('⏳ 5 min');
      if (timeDiff === 600) $utils.sendNotification('⏳ 10 min');

      return timeDiff >= 19800 ? 0 : timeDiff;
    },
    commentText() {
      let reviewData =
        shadowDOMSearch('yurt-review-root')[0].hostAllocatedMessage.reviewData;
      return reviewData.commentReviewData.commentThread.requestedComment
        .commentText;
    },
    safetyNetProtections() {
      let safetyNetDialog = shadowDOMSearch(
        'yurt-core-safety-nets-dialog'
      )?.[0];

      try {
        return safetyNetDialog?.safetyNetProtections
          ?.map((item) => `${item?.id} - ${item?.reason}`)
          .join('\n');
      } catch (e) {
        log(arguments.callee.name, e.stack);
      }
    },
    getCurrentTimeStr() {
      return $utils.formatTime($utils.get.timeElapsed());
    },
    videoLength(seconds) {
      let vl = shadowDOMSearch('#movie_player');
      if (!vl || !vl[0].innerText) return;
      vl = vl[0].innerText.split(' / ')[1];
      if (vl.split(':').length <= 2) {
        var mins =
          vl.split(':')[0] < 10 ? '0' + vl.split(':')[0] : vl.split(':')[0];
        vl = '0:' + mins + ':' + vl.split(':')[1];
      }
      if (!seconds) {
        return vl;
      }
      let h, m, s, result;
      let videoLengthArr = vl.split(':');
      if (videoLengthArr.length > 2) {
        [h, m, s] = videoLengthArr;
        result =
          parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10);
      } else {
        [m, s] = videoLengthArr;
        result = parseInt(m, 10) * 60 + parseInt(s, 10);
      }
      return result;
    },
    videoId() {
      return $utils.get.queueInfo().entityID;
    },
    videoTimestamp() {
      let videoRoot = shadowDOMSearch('yurt-video-root')[0];

      return $utils.formatTime(videoRoot.playerApi.getCurrentTime());
    },
    queueInfo() {
      var queueName;
      var queueTier;
      var entityID;
      var reviewStatus = shadowDOMSearch('yurt-review-root')?.[0];

      if (!reviewStatus?.hostAllocatedMessage) return;

      for (const property in Object.keys(reviewStatus.hostAllocatedMessage)) {
        if (
          Object.keys(reviewStatus.hostAllocatedMessage)[property] ===
          'queueName'
        ) {
          queueName = reviewStatus.hostAllocatedMessage.queueName;
          queueTier = reviewStatus.hostAllocatedMessage.queueTier;
          break;
        } else if (
          reviewStatus.hostAllocatedMessage[
            Object.keys(reviewStatus.hostAllocatedMessage)[property]
          ].hasOwnProperty('queue')
        ) {
          var queueData =
            reviewStatus.hostAllocatedMessage[
              Object.keys(reviewStatus.hostAllocatedMessage)[property]
            ].queue;
          queueName = queueData.name;
          queueTier = queueData.tier;
          break;
        }
      }
      entityID =
        reviewStatus.hostAllocatedMessage.yurtEntityId[
          Object.keys(reviewStatus.hostAllocatedMessage.yurtEntityId)[0]
        ];
      return { queueName, queueTier, entityID };
    },
    queueName() {
      let queueInfo = $utils.get.queueInfo();
      return queueInfo?.queueName?.toLowerCase();
    },
    queueLanguage() {
      return $utils.get.queueName()()?.split('-')?.[3]?.trim()?.toLowerCase();
    },
    seekVideo(timestampStr) {
      let videoRoot = shadowDOMSearch('yurt-video-root')[0];
      let timeArr = timestampStr.split(':');
      let h, m, s, secondsTotal;
      if (timeArr.length === 3) {
        // has hours : minutes : seconds
        [h, m, s] = timeArr;
        secondsTotal = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
      } else if (timeArr.length === 2) {
        // minutes : seconds
        [m, s] = timeArr;
        secondsTotal = parseInt(m) * 60 + parseInt(s);
      }

      log(secondsTotal);

      videoRoot.playerApi.seekTo(secondsTotal);
    },
    selectedVEGroup(label = false) {
      const textLabel = shadowDOMSearch(
        'mwc-select[value=strike_ve_group_dropdown]'
      )?.[0].selectedText;

      const value = shadowDOMSearch(
        'mwc-select[value=strike_ve_group_dropdown]'
      )?.[0].value;

      return label ? textLabel : value;
    },
  },
  questionnaire: {
    answerQuestion(answerArgs) {
      let FTOProduced3044 = {
        abuse_location: {
          listItem: { value: 'video' },
          checklist: { value: 'video_abusive' },
        },
        applicable_ve_group: { value: __veGroups.unknown },
        act_type: { value: 'glorification_terrorism' },
        video_features: 'todo',
        video_contents: [{ value: 'other' }],
        video_type: { value: 'compilation' },
        video_segment: true,
        confidence_level: { value: 'very_confident' },
      };
      let {
        abuse_location,
        applicable_ve_group,
        act_type,
        video_features,
        video_contents,
        video_type,
        video_segment,
        confidence_level,
      } = FTOProduced3044;

      let { clickNext } = $utils;
      let { checklist, listItem, checkbox } = $utils.click;
      let currentQuestions = shadowDOMSearch(
        'yurt-core-label-questionnaire-question-type-mapper'
      )?.[0]?.currentQuestions;
      log('current questions:', currentQuestions);

      if (!currentQuestions) {
        log('[?] Could not find questionnaire.currentQuestion');
        return;
      }

      // shadowDOMSearch(`mwc-checkbox[${key}=${value}]`)[0].click()

      if (currentQuestions?.length > 1) {
        // answer all questions:
        currentQuestions.forEach((subquestion) => {
          log('[i] subq', subquestion);
          let lastElementIndex = subquestion.id.split('/').length - 1;
          let questionId = subquestion.id.split('/')[lastElementIndex];

          if (questionId === 'abuse_location') {
            log(abuse_location.listItem);
            log(abuse_location.checklist);
            listItem(abuse_location.listItem);
            checklist(abuse_location.checklist);
            clickNext();
          } else if (questionId === 'applicable_ve_group') {
            listItem(applicable_ve_group);
            clickNext();
          } else if (questionId === 'act_type') {
            listItem(act_type);
          } else if (questionId === 'video_features') {
            // TODO (CHECKBOX ISSUE)
            let featured_person = shadowDOMSearch(
              `mwc-checkbox[value=featured_person]`
            )[0];
            log(featured_person);
            featured_person.click();
          } else if (questionId === 'video_contents') {
            video_contents.forEach((arg) => checkbox(arg));
          } else if (questionId === 'video_type') {
            listItem(video_type);
          } else if (questionId === 'borderline_video/borderline_decision') {
            listItem();
          } else if (
            questionId === 'video_segment' ||
            questionId === 'audio_segment'
          ) {
            questionId === 'audio_segment' &&
              $utils.click.element('tcs-button', {
                'data-test-id': 'label-questionnaire-time-annotation-button',
              });
            questionId === 'video_segment' &&
              $utils.click.element('tcs-button', {
                'data-test-id': 'label-questionnaire-time-annotation-button',
              });
            clickNext();
          } else if (questionId === 'confidence_level') {
            listItem(confidence_level);
          }

          log('✅ SUBQuestion Answered: ', questionId);
        });
      }

      // QuestionId is always the last in whole string
      let lastElementIndex = currentQuestions?.[0].id.split('/').length - 1;
      let questionId = currentQuestions?.[0].id.split('/')[lastElementIndex];

      if (questionId === 'abuse_location') {
        log(abuse_location.listItem);
        log(abuse_location.checklist);
        listItem(abuse_location.listItem);
        checklist(abuse_location.checklist);
        clickNext();
      } else if (questionId === 'applicable_ve_group') {
        listItem(applicable_ve_group);
        clickNext();
      } else if (questionId === 'act_type') {
        listItem(act_type);
      } else if (questionId === 'video_features') {
        // TODO (CHECKBOX ISSUE)
        shadowDOMSearch(`mwc-checkbox[value=featured_person]`)[0].click();
      } else if (questionId === 'video_contents') {
        video_contents.forEach((arg) => checkbox(arg));
      } else if (questionId === 'video_type') {
        listItem(video_type);
      } else if (questionId === 'borderline_video/borderline_decision') {
        listItem();
      } else if (
        questionId === 'video_segment' ||
        questionId === 'audio_segment'
      ) {
        questionId === 'audio_segment' &&
          $utils.click.element('tcs-button', {
            'data-test-id': 'label-questionnaire-time-annotation-button',
          });
        questionId === 'video_segment' &&
          $utils.click.element('tcs-button', {
            'data-test-id': 'label-questionnaire-time-annotation-button',
          });
        clickNext();
      } else if (questionId === 'confidence_level') {
        listItem(confidence_level);
      }

      log('✅ Question Answered: ', questionId);

      if (currentQuestions?.deferTraversal) {
        $utils.clickDone();
        log('Successfully submitted questioonaire');
      }
    },
    getQuestionnaire() {
      return shadowDOMSearch(
        'yurt-core-label-questionnaire-question-type-mapper'
      )?.[0];
    },
    getCurrentQuestions() {
      return shadowDOMSearch(
        'yurt-core-label-questionnaire-question-type-mapper'
      )?.[0]?.currentQuestions;
    },
    getAnswerIds() {
      return shadowDOMSearch(
        'yurt-core-label-questionnaire-question-type-mapper'
      )?.[0]?.currentQuestions?.forEach((question) =>
        question?.answers?.map((answer) => answer?.id)
      );
    },
    getQuestionType(questions) {
      return shadowDOMSearch(
        'yurt-core-label-questionnaire-question-type-mapper'
      )?.[0]?.currentQuestions?.map((question) => question.questionType);
    },
  },

  clickNext() {
    $utils.click.element('.next-button', { class: 'next-button' });
  },
  clickSubmit() {
    $utils.click.element('.submit-button');
    $utils.click.element('.primary.submit');
  },
  clickDone() {
    $utils.click.element('tcs-button', { name: 'label-submit' });
  },
  clickSave() {
    $utils.click.element('tcs-button', {
      'data-test-id': 'decision-annotation-save-button',
    });
  },
  formatTime(input) {
    let hoursString = 0;
    let minutesString = '00';
    let secondsString = Math.floor(input);

    if (secondsString > 59) {
      minutesString = secondsString / 60;
      minutesString = Math.floor(minutesString);
      secondsString = secondsString % 60;
    }

    if (minutesString > 59) {
      hoursString = minutesString / 60;
      hoursString = Math.floor(hoursString);
      minutesString = minutesString % 60;
    }

    if (
      (minutesString !== '00' && minutesString < 10) ||
      minutesString === '0'
    ) {
      minutesString = '0' + minutesString;
    }

    if (secondsString < 10) {
      secondsString = '0' + secondsString;
    }

    return `${hoursString}:${minutesString}:${secondsString}`;
  },

  appendNode(node, parent) {
    parent = shadowDOMSearch(
      'yurt-core-decision-annotation-tabs > div:nth-child(1)'
    )?.[0];

    // parent.style.marginBottom = '50px';
    try {
      parent?.appendChild(node);
    } catch (e) {
      log(arguments.callee.name, e.stack);
    }
  },

  async getChannelVideos() {
    let videosArr = await fetch(
      'https://yurt.corp.google.com/_/backends/account/v1/videos:fetch?alt=json&key=AIzaSyDYl294dgpLu1jAgBqOQ33gCSgou0zEd7U',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          externalChannelId:
            $reviewRoot.hostAllocatedMessage.reviewData.videoReviewData
              .videoReviewMetadata.externalChannelId,
          fetchLatestPolicy: true,
          maxNumVideosByRecency: 50,
          viewEnums: ['VIEW_INCLUDE_PINNED_COMMENT'],
        }),
      }
    ).then((response) => response.json());

    return videosArr;
  },
  async filterVideosByPolicy(policyId = '9008') {
    const { videos } = await this.getChannelVideos();

    let byPolicy = videos.filter(
      (video) => video.appliedPolicy?.id === policyId
    );

    let violativeIds = byPolicy.map((vid) => vid.externalVideoId).join(', ');
    return byPolicy;
  },
  async filterVideoByKeywords(keywordsArr) {
    const { videos } = await this.getChannelVideos();

    if (!keywordsArr) keywordsArr = $const.filterKeywords;
    let byKeyword = videos.filter((video) =>
      keywordsArr.some((word) => video.videoTitle.toLowerCase().includes(word))
    );

    let violativeVideoIds = byKeyword
      .map((vid) => vid.externalVideoId)
      .join(', ');

    return violativeVideoIds;
  },

  // SETTERS //
  addNote(noteStr) {
    let decisionCard = shadowDOMSearch('yurt-core-decision-policy-card')?.[0];
    try {
      decisionCard.annotation.notes = noteStr;
    } catch (e) {
      console.log(
        `[❌ ${arguments.callee.name}]`,
        e.stack,
        '\n[i] Could not add note'
      );
    }
  },
  expandNotesArea(rows = 12, actionType = 'route') {
    let notesTextArea;
    notesTextArea = actionType = 'route'
      ? shadowDOMSearch('.mdc-text-field__input')?.[0]
      : shadowDOMSearch(
          'mwc-textarea[data-test-id=core-decision-policy-edit-notes]'
        )?.[0];

    // increase size of note input box
    notesTextArea.rows = rows;
  },
  setTimer(vremya, reload = $const.is.autosubmit()) {
    // clean old submit timer
    if ($timers.SUBMIT_ID) {
      log(`Cleaning up timerId: ${$timers.SUBMIT_ID}.`);
      clearTimeout($timers.SUBMIT_ID);
      $timers.SUBMIT_ID = null;
      console.table($timers);
    }

    // clean old reload timer
    if ($timers.RELOAD_ID) {
      log(`[i] Cleaning up reloadId: ${$timers.RELOAD_ID}.`);
      clearTimeout($timers.RELOAD_ID);
      $timers.RELOAD_ID = null;
    }

    if (!$const.is.readyForSubmit()) {
      action.video.review('russian', '9008');
    }

    $timers.SUBMIT_ID = setTimeout(
      () => $utils.clickSubmit(),
      vremya * 60 * 1000
    );

    log(
      `⌚ ✅ Submit in ${vremya} minutes, at ${new Date(
        Date.now() + vremya * 60 * 1000
      )
        .toJSON()
        .split('T')[1]
        .slice(0, 8)}.`
    );

    if (reload) {
      log(`🔃 ... with reload.`);

      $timers.RELOAD_ID = setTimeout(
        window.location.reload.bind(window.location),
        // window.close,
        vremya * 60 * 1000 + 3000
      );
    }

    $utils.removeLock();
    console.table($timers);
  },
  setPageReload(minutes, reset = false) {
    if (reset) {
      clearTimeout($timers.RELOAD_ID);
      $timers.RELOAD_ID = undefined;
      return;
    }
    $timers.RELOAD_ID = setTimeout(
      window.location.reload.bind(window.location),
      // window.close,
      minutes * 60 * 1000
    );
  },
  setFrequentlyUsedPolicies() {
    try {
      shadowDOMSearch(
        'yurt-video-decision-panel-v2'
      )[0].frequentlyUsedPolicies = $const.frequentlyUsedPolicies;
    } catch (e) {
      log(arguments.callee.name, e.stack);
    }
  },
  closePage(ms) {
    setTimeout(window.close, ms);
  },
  sendNotification(text, close = true) {
    let n = new Notification(text);
    // this.clearLastNotification();
    n.onclick = () => {
      parent.focus();
      window.focus();
    };

    // clear notification after 10 seconds
    close &&
      setTimeout(() => n.close(), $config.NOTIFICATION_TIMEOUT_SEC * 1000);
  },
  fullReset() {
    clearInterval($timers.LOCK_INTERVAL);
    clearInterval($timers.RELOAD_ID);
    clearInterval($timers.SUBMIT_ID);
    clearTimeout($timers.SUBMIT_ID);
    clearInterval($timers.MY_REVIEWS_INTERVAL);
    clearInterval($timers.STRIKE_ID);
    $const.AUTOSUBMIT = false;

    [
      $timers.LOCK_INTERVAL,
      $timers.RELOAD_ID,
      $timers.SUBMIT_ID,
      $timers.MY_REVIEWS_INTERVAL,
      $timers.STRIKE_ID,
    ] = [null, null, null, null, null];

    console.table($timers);
  },
  removeLock(reset = false) {
    let lock = shadowDOMSearch('yurt-review-activity-dialog')[0];
    lock.lockTimeoutSec = 3000;
    lock.secondsToExpiry = 3000;
    lock.onExpired = () => {};

    if (reset) {
      lock.lockTimeoutSec = 1200;
      lock.secondsToExpiry = 1200;
    }
    log(
      `🔐LOCK: ${$utils.formatTime(
        shadowDOMSearch('yurt-review-activity-dialog')[0].secondsToExpiry
      )}`
    );
  },
  changeFavIcon(icon) {
    let currentIcon = document.querySelector("link[rel~='icon']");
    currentIcon.href = icon ? icon : 'https://www.google.com/favicon.ico';
  },
  dVideo() {
    let ytpPlayer = shadowDOMSearch('ytp-player')?.[0];
    return JSON.parse(ytpPlayer.playerVars.player_response).streamingData
      .formats[0].url;
  },
  dVideoNew() {
    return $reviewRoot.hostAllocatedMessage.reviewData.videoReviewData
      .playerMetadata.playerResponse.uneditedVideoInfo.previewServerUrl;
  },
  clearTimers() {
    Object.keys($timers).forEach((timer) => {
      clearTimeout($timers[timer]);
      clearInterval($timers[timer]);
      log(`[🧹] removed ${timer} = ${$timers[timer]}`);
      $timers.timer = 0;
    });
  },
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

  log(`[❔] Answering ${questionId}.`);

  // Video Strike
  if (questionId === 'abuse_location') {
    listItem(abuse_location.listItem);
    checklist(abuse_location.checklist);
  } else if (questionId === 'applicable_ve_group') {
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

  log(`[✅] Question Answered: ${questionId}`);
  if (question.deferTraversal) {
    clickDone();
    clearInterval($timers.STRIKE_ID);
    log('[✅] Questionnaire Submitted');
    // render notes recommendations for strike with chosen policy id

    const chosenPolicyId = shadowDOMSearch('yurt-core-questionnaire')?.[0]
      ?.policy?.id;

    setTimeout(() => $utils.expandNotesArea(), 1);

    // SHOW RECOMMENDATIONS
    __UI.components
      .recommendationPanel({
        notesArr: recommendationNotes.strike[chosenPolicyId],
      })
      .render();
  }
}

function answerQuestionnaire(answerArgs) {
  let currentQuestions = shadowDOMSearch(
    'yurt-core-label-questionnaire-question-type-mapper'
  )?.[0]?.currentQuestions;

  if (!currentQuestions) {
    return;
  }

  if (currentQuestions?.length > 1) {
    currentQuestions.forEach((subQuestion) =>
      answerQuestion(subQuestion, answerArgs)
    );
    return;
  }

  try {
    answerQuestion(currentQuestions[0], answerArgs);
  } catch (e) {
    log(arguments.callee.name, e.stack);
  } finally {
    return;
  }
}

function clearTimers() {
  Object.keys($timers).forEach((timer) => {
    clearTimeout($timers[timer]);
    clearInterval($timers[timer]);
    log(`[🧹] removed ${timer} = ${$timers[timer]}`);
    $timers.timer = 0;
  });
}

async function $main() {
  // Event Listeners & Notifications
  window.addEventListener('message', function (event) {
    const { click, sendNotification, removeLock } = $utils;
    const notFocused = () => !document.hasFocus();

    // New video, send notification if not focused
    if (event.data.name === 'HOST_ALLOCATED') {
      notFocused() && sendNotification(`New item 👀`);

      $utils.setFrequentlyUsedPolicies();
      removeLock();

      // click reviews tab
      setTimeout(() => {
        log("[i] Click 'My Reviews Tab'");
        click.element('mwc-tab', {
          label: '"My Reviews (0)"',
        });
        click.element('mwc-tab', {
          label: '"My Reviews"',
        });
      }, 1500);
    }

    // Submitted video, send notification
    if (event.data.name === 'APP_REVIEW_COMPLETED' && notFocused()) {
      sendNotification(
        `✅ Submitted at ${new Date().toJSON().split('T')[1].slice(0, 8)}`
      );

      // removeLock();
    }
  });

  // TIMERS
  if (!$timers.DISPLAY_STOPWATCH || !$timers.ACTION_PANEL) __UI.render();
}

let $props = {
  dropdown: {
    strike: {
      label: 'Select VE Group',
      value: 'strike_ve_group_dropdown',
      options: [
        { value: __veGroups.wagner, label: 'Wagner PMC' },
        { value: __veGroups.alq, label: 'Al Qaeda' },
        { value: __veGroups.isis, label: 'ISIS' },
        { value: __veGroups.hamas, label: 'Hamas' },
        { value: __veGroups.hezbollah, label: 'Hezbollah' },
        { value: __veGroups.ira, label: 'IRA' },
        { value: __veGroups.lte, label: 'LTTE' },
        { value: __veGroups.unknown, label: 'UNKNOWN' },
        { value: __veGroups.vnsa, label: 'VNSA' },
      ],
    },
    route: {
      label: 'Target Queue',
      value: 'route_target_queue_dropdown',
      options: [
        { value: ['graphic violence'], label: 'Graphic Violence' },
        { value: ['drugs'], label: 'Drugs & Illegal Sales' },
        { value: ['hate'], label: 'Hate Speech' },
        { value: ['dangerous acts'], label: 'Harmful & Dangerous' },
        { value: ['spam'], label: 'Spam' },
        { value: ['harassment'], label: 'Harassment' },
        { value: ['digital', 'video'], label: 'Digital Security' },
        { value: ['misinformation'], label: 'Misinformation' },
        { value: ['child safety'], label: 'Child Safety' },
        { value: ['indian', 've'], label: 'Indian Languages' },
        { value: ['xlang', 'xpol'], label: 'XLang XPol' },
        { value: ['t2'], label: 'T2' },
        { value: ['fte'], label: 'FTE' },
      ],
    },
  },
  button: {
    approve: [
      { text: '🇷🇺 RU', onClick: () => action.video.review('russian') },
      { text: '🇺🇦 UA', onClick: () => action.video.review('ukrainian') },
      { text: '🇬🇧 ENG', onClick: () => action.video.review('english') },
      {
        text: '❔ AGN',
        onClick: () => action.video.review('Language agnostic'),
      },
      { text: '🔳 N/A', onClick: () => action.video.review('blank') },
    ],
    strike: [
      {
        text: '🎯 SONG',
        onClick: () => action.video.strike($const.strikeAnswers.song),
      },
      {
        text: '🎯 VIDEO',
        onClick: () => action.video.strike($const.strikeAnswers.video),
      },
      {
        text: '🎯 Speech',
        onClick: () => action.video.strike($const.strikeAnswers.speech),
      },
      {
        text: '5013',
        onClick: () => {
          action.video.steps.addReview();

          action.video.steps.selectPolicy('5013');
          action.video.steps.selectLanguage('russian');
        },
      },
    ],
    route: [
      {
        text: '🇸🇦 Arabic',
        onClick: () =>
          action.video.route(
            've xsource arabic',
            'arabic',
            'routing for language'
          ),
      },
      {
        text: '💉💲 Drugs',
        onClick: () => action.video.route('drugs xsource', 'drugs'),
      },
      {
        text: '🧨 H&D ',
        onClick: () => action.video.route('Harmful Dangerous Acts', 'hd'),
      },
      {
        text: '🥩 Graphic',
        onClick: () => action.video.route('graphic violence xsource', 'gv'),
      },
      {
        text: '⚡ Hate',
        onClick: () => action.video.route('hate russian', 'hate'),
      },
      {
        text: '🏹 Harass',
        onClick: () =>
          action.video.route('harassment xsource russian', 'harass'),
      },
      { text: '🔞 Adult', onClick: () => action.video.route('adult', 'adult') },
      { text: '📬 SPAM', onClick: () => action.video.route('spam', 'spam') },
      {
        text: '💽 DS',
        onClick: () => action.video.route('digital security video', 'ds'),
      },
      {
        text: '🧒 Child',
        onClick: () => action.video.route('child minors', 'cs'),
      },
      {
        text: '🗞 Misinfo',
        onClick: () => action.video.route('misinfo'),
      },
      {
        text: '🔐 T2/FTE',
        onClick: () => action.video.route('t2', 't2', 'protections'),
      },
    ],
    comments: [
      {
        text: 'Al Qaeda',
        onClick: () =>
          action.comment.strikeComment('alq', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: ' BLA',
        onClick: () =>
          action.comment.strikeComment('bla', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🇵🇸 Hamas',
        onClick: () =>
          action.comment.strikeComment('hamas', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🇱🇧 Hezbollah',
        onClick: () =>
          action.comment.strikeComment('hezbollah', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🇮🇪 IRA',
        onClick: () =>
          action.comment.strikeComment('ira', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🏴‍☠ ISIS',
        onClick: () =>
          action.comment.strikeComment('isis', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🇱🇰 LTTE',
        onClick: () =>
          action.comment.strikeComment('lte', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🟥 PKK',
        onClick: () =>
          action.comment.strikeComment('pkk', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '🇵🇰 TTP',
        onClick: () =>
          action.comment.strikeComment('taliban', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: ' VNSA',
        onClick: () =>
          action.comment.strikeComment('vnsa', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: 'OSAMA',
        onClick: () =>
          action.comment.strikeComment(
            'osama',
            $config.COMMENTS_TIMER_MIN,
            'gdp_speaker_type'
          ),
      },
      {
        text: 'Unknown',
        onClick: () =>
          action.comment.strikeComment('unknown', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: '❔ Custom',
        onClick: () =>
          action.comment.strikeComment('', $config.COMMENTS_TIMER_MIN),
      },
      {
        text: 'Custom GDP',
        onClick: () =>
          action.comment.strikeComment('', $config.COMMENTS_TIMER_MIN, 'isGDP'),
      },
      { text: '⏭ Hate', onClick: () => action.video.route('hate') },
      { text: 'X L A N G', onClick: () => action.video.route('xlang') },
    ],
    timers: [
      {
        text: '1',
        onClick: () => $utils.setTimer(1, $const.is.autosubmit()),
      },
      {
        text: '2',
        onClick: () => $utils.setTimer(2, $const.is.autosubmit()),
      },
      {
        text: '3',
        onClick: () => $utils.setTimer(3, $const.is.autosubmit()),
      },
      {
        text: '4',
        onClick: () => $utils.setTimer(4, $const.is.autosubmit()),
      },
      {
        text: '5',
        onClick: () => $utils.setTimer(5, $const.is.autosubmit()),
      },
    ],
  },
};

let __UI = {
  // Atomic Design System for creating components
  atoms: {
    card: ({ children }) => {
      let elem = strToNode(`<yurt-core-card></yurt-core-card>`);

      if (children?.length > 1) {
        children.forEach((child) => elem.appendChild(child));
        return elem;
      }

      elem.appendChild(children);
      return elem;
    },
    button: ({ text, onClick, spec = 'flat-primary' }) => {
      let btnStr = `<tcs-button ${spec && `spec=${spec}`}>${text}</tcs-button>`;

      let btn = strToNode(btnStr);
      btn.onclick = onClick;
      return btn;
    },

    addNoteSwitch: strToNode(
      `<mwc-formfield class='add-note-switch'><mwc-switch></mwc-mwc-switch></mwc-formfield><tcs-text text="🗒Add Note" spec="body" texttype="default"></tcs-text>`
    ),
  },
  molecules: {
    dropdown: ({ label, value, options }) => {
      return strToNode(`<mwc-select naturalmenuwidth outlined label="${label}" value="${value}">
                ${options
                  ?.map(
                    (option) =>
                      `<mwc-list-item outlined ${
                        option.label.includes('Wagner') ? 'selected' : ''
                      } value="${option.value}" role="option">${
                        option.label
                      }</mwc-list-item>`
                  )
                  .join('')}
              </mwc-select>`);
    },
  },
  components: {
    // Ready UI Components

    btns: () => {
      const { button: createButton } = __UI.atoms;
      const { button: btnProps } = $props;

      return {
        approve: btnProps.approve.map(({ text, onClick }) =>
          createButton({ text, onClick })
        ),
        strike: btnProps.strike.map(({ text, onClick }) =>
          createButton({ text, onClick })
        ),
        route: btnProps.route.map(({ text, onClick }) =>
          createButton({ text, onClick })
        ),
        comments: btnProps.comments.map(({ text, onClick }) =>
          createButton({ text, onClick })
        ),
      };
    },

    // KNOWS HOW TO RENDER ITSELF
    actionPanel: () => {
      const { dropdown: createDropdown } = __UI.molecules;

      let wrapperDiv = strToNode(
        `<div style="display: grid; grid-template-columns: repeat(2, 2fr)"></div>`
      );

      let routeDropdown = createDropdown($props.dropdown.strike);

      let routeDiv = strToNode(`<div id="action-panel__route"></div>`);
      let approveDiv = strToNode(`<div id="action-panel__route"></div>`);

      approveDiv.replaceChildren(...__UI.components.btns().approve);
      routeDiv.replaceChildren(...__UI.components.btns().route);

      wrapperDiv.replaceChildren(routeDiv, approveDiv);
      wrapperDiv.setAttribute('class', 'action-panel');

      let element = __UI.atoms.card({ children: wrapperDiv });

      // element.style.marginTop = '300px';

      return {
        element,
        render() {
          if (shadowDOMSearch('.action-panel')?.[0]) return;
          $utils.appendNode(element);
        },
      };
    },
    commentsPanel: () => {
      commentsPanelWrapper = strToNode(
        `<tcs-view wrap="wrap" class="action-panel__comments" spacing="small"></tcs-view>`
      );

      commentsPanelWrapper.replaceChildren(...__UI.components.btns().comments);

      let element = __UI.atoms.card({ children: commentsPanelWrapper });

      return {
        element,
        render() {
          // return if there is a panel already
          if (shadowDOMSearch('.action-panel__comments')?.[0]) return;

          $utils.appendNode(element);
        },
      };
    },
    strikePanel: () => {
      const { dropdown: createDropdown } = __UI.molecules;
      const { card: createCard } = __UI.atoms;

      const dropdownMenu = createDropdown($props.dropdown.strike);
      const strikeBtnContainer = strToNode(
        `<div class="strike-panel container"></div>`
      );

      strikeBtnContainer.replaceChildren(
        dropdownMenu,
        ...__UI.components.btns().strike
      );

      const element = createCard({
        children: strikeBtnContainer,
      });

      return {
        element,
        render() {
          // return if there is a panel already
          if (shadowDOMSearch('.strike-panel')?.[0]) return;

          $utils.appendNode(element);
        },
      };
    },
    stopwatchPanel() {
      const stopwatchWrapper = strToNode(
        `<tcs-view spec="row" onclick="() => __UI.components.stopwatchPanel().showTimers()" class="stopwatch container"></tcs-view>`
      );

      const getTimeStr = () => `${$utils.formatTime($utils.get.timeElapsed())}`;

      const stopwatchDisplay = strToNode(
        `<tcs-text>${getTimeStr()}</tcs-text>`
      );

      let parentNode = shadowDOMSearch(
        'yurt-core-plugin-header > div > tcs-view'
      )?.[0];

      stopwatchWrapper.appendChild(stopwatchDisplay);

      // SUPERUSER check
      if ($config.SU) {
        stopwatchWrapper.oncontextmenu = () => {
          history.pushState({}, '', '#yort');
          window.open('https://yurt.corp.google.com/#review');
        };

        stopwatchWrapper.onclick = () => {
          $utils.removeLock();
          __UI.components.stopwatchPanel().showTimers();
          setTimeout(() => __UI.components.stopwatchPanel().showTimers(), 4000);
        };
      }

      return {
        element: stopwatchWrapper,
        tick() {
          stopwatchDisplay.innerText = getTimeStr();
        },
        render() {
          // Already exists, don't render
          if (shadowDOMSearch('.stopwatch')?.[0]) return;

          if ($const.is.queue('comments')) {
            parentNode = shadowDOMSearch('tcs-text[spec=title-2]')?.[0]
              ?.shadowRoot;
          }

          try {
            parentNode.appendChild(stopwatchWrapper);

            $timers.DISPLAY_STOPWATCH = setInterval(() => {
              this.tick();
            }, 1000);
          } catch (e) {
            log('[❌] Could not append stopwatchPanel', e.stack);
          }
        },
        showTimers() {
          let existingTimers = shadowDOMSearch('.timers')?.[0];
          if (existingTimers) {
            existingTimers.remove();
            return;
          }
          let timersWrapper = strToNode(
            `<tcs-view class="timers container" spec="row"><tcs-button spec="flat-primary" class="timer-btn" onclick="$utils.setTimer(1, ${$const.is.autosubmit()});">1</tcs-button>
                    <tcs-button spec="flat-primary" class="timer-btn" onclick="$utils.setTimer(2, ${$const.is.autosubmit()});">2</tcs-button>
                    <tcs-button spec="flat-primary" class="timer-btn" onclick="$utils.setTimer(3, ${$const.is.autosubmit()});">3</tcs-button>
                    <tcs-button spec="flat-primary" class="timer-btn" onclick="$utils.setTimer(4, ${$const.is.autosubmit()});">4</tcs-button>
                    <tcs-button spec="flat-primary" class="timer-btn" onclick="$utils.setTimer(5, ${$const.is.autosubmit()});">5</tcs-button>
                    <mwc-checkbox value="autoreload-page"></mwc-checkbox></tcs-view>`
          );
          parentNode.appendChild(timersWrapper);
        },
      };
    },
    approveNotesPanel() {
      const container = strToNode(
        `<div class="approve-notes container"></div>`
      );

      let panel = strToNode(
        `<mwc-list>${recommendationNotes.approve
          .map(
            (note) =>
              `<mwc-list-item class="recommendation-item" graphic="avatar" value="${note.value()}"><tcs-text>${
                note.title
              }</tcs-text><mwc-icon slot="graphic">note_add</mwc-icon></mwc-list-item>`
          )
          .join('')}</mwc-list>`
      );

      // add onclicks
      [...panel.childNodes].forEach(
        (noteItem) =>
          (noteItem.onclick = () => {
            // APPROVE NOTE RECOMMENDATION
            $utils.addNote(noteItem.value);
            console.log('note', noteItem.value);
            shadowDOMSearch('tcs-icon-button#create')?.[0]?.click();
            $utils.clickSave();
          })
      );

      container.appendChild(panel);

      return {
        element: container,
        render() {
          if (shadowDOMSearch('.approve-notes')) return;
          $utils.appendNode(container);
        },
      };
    },
    recommendationPanel({ notesArr }) {
      // don't recommend in comments FOR NOW
      if ($const.is.queue('comments')) return;

      // create
      const container = strToNode(
        `<div class="notes-recommendation container"></div>`
      );

      let recommendationList = strToNode(
        `<mwc-list>${notesArr
          .map(
            (note) =>
              `<mwc-list-item class="recommendation-item" graphic="avatar" value="${note.value()}"><span>${
                note.title
              }</span><mwc-icon slot="graphic">note_add</mwc-icon></mwc-list-item>`
          )
          .join('')}</mwc-list>`
      );

      [...recommendationList.childNodes].forEach(
        (node) =>
          (node.onclick = () => {
            console.log('action.video.steps.addNote(item.value)');
            action.video.steps.addNote(node.value);
          })
      );

      container.appendChild(recommendationList);

      return {
        element: container,
        render() {
          // find parent
          const parent =
            shadowDOMSearch('yurt-core-decision-route')?.[0]?.shadowRoot ||
            shadowDOMSearch('yurt-core-decision-annotation-edit')?.[0]
              ?.shadowRoot;

          parent?.appendChild(container);
        },
      };
    },
    configPanel() {
      let configPanel = strToNode(
        `<tcs-view class="config-panel" spacing="small"></tcs-view>`
      );
      let noteSwitch = strToNode(
        `<div><mwc-formfield><mwc-switch></mwc-mwc-switch></mwc-formfield><tcs-text text="🗒Add Note" spec="body" texttype="default"></tcs-text></div>`
      );

      let autoSubmit = strToNode(
        `<div><mwc-formfield><mwc-switch></mwc-mwc-switch></mwc-formfield><tcs-text text="Submit?" spec="body" texttype="default"></tcs-text></div>`
      );

      configPanel.replaceChildren(
        ...noteSwitch.children,
        ...autoSubmit.children
      );
      return configPanel;
    },
  },

  // methods
  render() {
    const {
      actionPanel,
      commentsPanel,
      strikePanel,
      stopwatchPanel,
      approveNotesPanel,
    } = this.components;

    try {
      // render UI components every X seconds using setInterval
      if (!$timers.STOPWATCH_ID) {
        if (shadowDOMSearch('.stopwatch')) return;
        $timers.STOPWATCH_ID = setInterval(
          () => stopwatchPanel().render(),
          $config.FUNCTION_CALL_RETRY_MS
        );
      }

      if ($const.is.queue('comments')) {
        commentsPanel().render();
        return;
      }

      if (!$timers.RIGHT_PANEL_ID) {
        $timers.RIGHT_PANEL_ID = setInterval(() => {
          if (shadowDOMSearch('.superuser-panel')) return;
          $utils.appendNode(rightPanel);
        }, $config.FUNCTION_CALL_RETRY_MS);
      }

      // if (!shadowDOMSearch('.strike-panel')) {
      //   clearInterval($timers.STRIKE_PANEL);
      //   $timers.STRIKE_PANEL = setInterval(() => {
      //     strikePanel().render();
      //   }, $config.FUNCTION_CALL_RETRY_MS);
      // }

      // if (!shadowDOMSearch('.approve-notes')) {
      //   // render logic
      //   clearInterval($timers.APPROVE_NOTES_PANEL);

      //   $timers.APPROVE_NOTES_PANEL = setInterval(() => {
      //     approveNotesPanel().render();
      //   }, $config.FUNCTION_CALL_RETRY_MS);
      // }
    } catch (e) {
      if ($config.showLogs) {
        log('[❌] :: UI.render() :: Could not append action panel.');
      }

      if ($config.showErrors) {
        console.error(e);
      }
    }
  },
};

let rightPanel = (function () {
  const { actionPanel, strikePanel, approveNotesPanel } = __UI.components;

  let container = strToNode(
    `<div class="superuser-panel" style="padding-bottom: 500px;"></div>`
  );
  const elemsArr = [
    actionPanel().element,
    strikePanel().element,
    approveNotesPanel().element,
  ];
  elemsArr.forEach((elem) => container.appendChild(elem));

  return container;
})();

let $timers = {
  SUBMIT_ID: null,
  STOPWATCH_ID: null,
  RELOAD_ID: null,
  DISPLAY_STOPWATCH: null,
};

let action = {
  video: {
    // click add review, select policy, select language etc...
    steps: {
      addReview() {
        $utils.click.element('tcs-button', {
          'data-test-id': 'decision-add-review-button',
        });

        setTimeout(() => {
          $utils.setFrequentlyUsedPolicies();
          expandAddReview();
        }, 1);
      },
      selectPolicy(policyId) {
        let policiesNodeList = shadowDOMSearch(
          'yurt-core-policy-selector-item'
        );

        if (!policiesNodeList) {
          // log('[recursion] looking for 9008 tag');
          // FIX
          setTimeout(
            () => action.video.steps.selectPolicy(policyId),
            $config.FUNCTION_CALL_RETRY_MS
          );
          return;
        }

        let policiesArr = Array.from(policiesNodeList);
        let policyElement = policiesArr.filter(
          (p) => p['policy']?.['id'] === policyId
        )?.[0];

        // log('approvePolicyTag');
        policyElement?.click();
      },
      selectLanguage(language) {
        let russian = shadowDOMSearch(
          `mwc-list-item[value="${
            language.slice(0, 1).toUpperCase() + language.slice(1)
          }"]`
        )?.[0];

        if (!russian) {
          setTimeout(
            () => action.video.steps.selectLanguage(language),
            $config.FUNCTION_CALL_RETRY_MS
          );
          return;
        }
        russian.click();
        log('[Select Language] Clicked ', language);
        return;
      },
      isRelatedToVE(related = 'no') {
        let possibleValues = ['no', 'yes_borderline', 'yes_edsa'];
        $utils.click.radio({ value: 'no' });
      },
      addNote(note) {
        try {
          let noteInputBox =
            shadowDOMSearch('.notes-input')?.[0] ||
            shadowDOMSearch(
              'mwc-textarea[data-test-id=core-decision-policy-edit-notes]'
            )?.[0];

          noteInputBox.value = note;
          action.video.steps.selectTextArea();
        } catch (e) {
          log(arguments.callee.name, e.stack);
        }
      },
      selectTextArea() {
        let link;
        link = shadowDOMSearch('.mdc-text-field__input')[0];

        // log('text area');
        link && link.select();
      },
    },
    // actual complete actions
    review(language = 'russian', policyId = '9008', relatedToVE = 'no') {
      // There is a policy already
      if ($const.is.readyForSubmit()) return;

      let { clickNext, clickDone, clickSave, clickSubmit } = $utils;
      let { addReview, selectPolicy, selectLanguage, isRelatedToVE } =
        action.video.steps;

      addReview();
      selectPolicy(policyId);
      isRelatedToVE(relatedToVE);

      // clickNext();
      clickDone();
      clickSave();
      selectLanguage(language);

      // SHOW RECOMMENDATIONS
      setTimeout(
        () =>
          __UI.components
            .recommendationPanel({ notesArr: recommendationNotes.approve })
            .render(true),
        1000
      );
    },
    route(queue, noteType, reason = 'policy vertical') {
      // TODO
      // let { queue, noteType, reason } = routeOptions;

      // helper functions
      function clickRoute() {
        let routeBtn = shadowDOMSearch('.route-button')?.[0];
        routeBtn.click();
      }

      function $selectTarget(queue, reason) {
        const { listItemByInnerText } = $utils.click;

        listItemByInnerText(...queue.split(' '));
        listItemByInnerText(reason);
      }

      function selectTextArea() {
        let textArea = shadowDOMSearch('.mdc-text-field__input')[0];
        textArea.select();
      }

      // actual routing process
      clickRoute();
      setTimeout(() => $selectTarget(queue, reason), 1);
      setTimeout(selectTextArea, 1);
      setTimeout(() => $utils.expandNotesArea(), 1);

      // show recommendations for routing to target queue
      setTimeout(
        () =>
          __UI.components
            .recommendationPanel({
              notesArr: recommendationNotes.route[noteType],
            })
            .render(),
        1
      );
    },
    strike(answers) {
      const { addReview, selectLanguage } = action.video.steps;

      let veGroup = $utils.get.selectedVEGroup();

      selectedVEGroup = $utils.get.selectedVEGroup(true);

      answers.applicable_ve_group = { value: veGroup };

      addReview();
      veGroup === 'wagner_pmc' && selectLanguage('russian');
      setTimeout(
        () =>
          shadowDOMSearch(
            'mwc-textfield[data-test-id=policy-selector-mwc-textfield]'
          )?.[0]?.focus(),
        $config.FUNCTION_CALL_RETRY_MS
      );

      log('[i] Questionnaire Answers:', answers);

      if ($timers.STRIKE_ID) {
        clearInterval($timers.STRIKE_ID);
      }
      $timers.STRIKE_ID = setInterval(
        () => answerQuestionnaire(answers),
        $config.CLICK_BUTTON_INTERVAL_MS
      );
    },
  },
  comment: {
    steps: {
      selectVEpolicy(commentPolicy = 'FTO') {
        let policiesArr = Array.from(
          shadowDOMSearch('yurt-core-policy-selector-item') || []
        );
        let VEpolicy = policiesArr?.filter((item) => {
          let tags = item.policy.tags;
          return tags?.includes(commentPolicy);
        })[0];

        if (!VEpolicy) {
          () => this.selectVEpolicy(commentPolicy);
          return;
        }
        log('selectVEpolicy', commentPolicy);
        VEpolicy.click();
      },

      selectActionType(actionType = 'generic_support') {
        log('selectActionType', actionType);

        $utils.click.element('mwc-radio', { value: actionType });
      },

      VEgroupType(veType = 've_group_type') {
        log('VEgroupType', veType);
        $utils.click.element('mwc-radio', { value: veType });
      },

      selectVEgroup(targetGroup) {
        log('selectVEgroup', targetGroup);

        const VEgroupsArr = Array.from(shadowDOMSearch('mwc-list-item'));

        if (VEgroupsArr.length < 20 || !VEgroupsArr) {
          // error check
          setTimeout(
            () => action.comment.steps.selectVEgroup(targetGroup),
            $config.FUNCTION_CALL_RETRY_MS
          );
          return;
        }

        function getVEGroup() {
          let group = VEgroupsArr?.filter((item) => {
            // log(item.value);
            // log(groupsMap[targetGroup]);
            return item.value === __veGroups[targetGroup];
          })[0];
          return group;
        }

        let group = getVEGroup();
        log('getVEGroup', group);

        group && group?.click();
      },

      selectRelevance(relevance = 'comment_text') {
        log('selectRelevance', relevance);

        $utils.click.element('mwc-checkbox', { value: relevance });
      },

      selectStamp(stampType = 'the_whole_comment') {
        log('selectRelevance', stampType);

        $utils.click.element('mwc-radio', { value: stampType });
      },
    },
    strikeComment(VEGroup, timerMin, groupType = 've_group_type') {
      // there is a policy card, means a policy has been set already
      // if (!shadowDOMSearch('yurt-core-decision-policy-card')?.[0]) {
      //   return;
      // }
      let {
        selectVEpolicy,
        selectActionType,
        VEgroupType,
        selectVEgroup,
        selectRelevance,
        selectStamp,
      } = action.comment.steps;
      let { clickNext, clickDone } = $utils;

      selectVEpolicy();
      selectActionType();
      // clickNext();
      VEgroupType(groupType);
      // clickNext();
      selectVEgroup(VEGroup);
      clickNext();
      selectRelevance();
      clickNext();
      selectStamp();
      // clickNext();
      clickDone();
      if (timerMin) {
        $utils.setTimer(timerMin, false);
      }
    },
    approveComment: () => {
      let policiesArr = Array.from(
        shadowDOMSearch('yurt-core-policy-selector-item')
      );
      let approvePolicy = policiesArr.filter(
        (policy) => policy.policy.id === '35265'
      )[0];

      approvePolicy.click();
    },
    routeComment: (targetQueue) => {
      // TODO?
      let routeTargetsArr = Array.from(shadowDOMSearch('mwc-list-item'));
      let hate = routeTargetsArr.filter(
        (target) =>
          target.innerHTML.includes('Hate') &&
          target.innerHTML.includes('English')
      )[0];
      let xlang = routeTargetsArr.filter((target) =>
        target.innerHTML.includes('Xlang')
      )[0];
      let policyVertical = routeTargetsArr.filter((target) =>
        target.innerHTML.includes('policy vertical')
      )[0];
      let routeBtn = shadowDOMSearch('.submit')[0];
    },
  },
};

if ($config.SU) {
  document.onkeypress = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      // Full reset
      case 99 || 'c':
        $utils.fullReset();
        break;
      // Submit Lang
      case 60 || '<':
        log(`submit rus`);
        action.video.approveVideo('russian');
        break;
      // Submit agnostic
      case 91 || '[':
        action.video.approveVideo('agnostic');
        break;
      // Submit Blank
      case 93:
        action.video.approveVideo('blank');
        break;

      // Submit English
      case 39:
        action.video.approveVideo('english');
        break;

      // Click Submit
      case 96 || '`':
        if ($const.is.queue('comments')) {
          action.comment.approveComment();
        }

        try {
          $utils.clickSave();
        } catch (e) {
          log('❌ Could not click Save.');
        }

        try {
          $utils.clickSubmit();
        } catch (e) {
          log('❌ Could not click Submit.');
        }

        break;

      // Route:
      // arabic
      case 47 || '/':
        action.video.route('arabic');
        break;
      // gv
      case 42 || '*':
        action.video.route('gv');
        break;
      // adult
      case 45 || '-':
        action.video.route('adult');
        break;

      default:
        break;
    }
  };
}

$main();
$utils.removeLock();

// [✅] radu pidar
