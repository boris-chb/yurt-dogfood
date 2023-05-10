// [50115] Promotion of Violence and Violent Extremism

async function $getChannelVideos() {
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
        maxNumVideosByRecency: 10000,
        viewEnums: ['VIEW_INCLUDE_PINNED_COMMENT'],
      }),
    }
  ).then((response) => response.json());

  return videosArr;
}

async function $filterChannelVideos(policyId = '9008') {
  const { videos } = await $getChannelVideos();
  return videos.filter((video) => video.appliedPolicy?.id === policyId);
}

async function filterVideosByKeyword(keyword) {
  const { videos } = await $getChannelVideos();
  return videos.filter(video => video.videoTitle.)
}