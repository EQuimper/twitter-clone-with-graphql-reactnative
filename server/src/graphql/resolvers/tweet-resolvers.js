import Tweet from '../../models/Tweet';

export default {
  getTweets: () => Tweet.find({}),
};
