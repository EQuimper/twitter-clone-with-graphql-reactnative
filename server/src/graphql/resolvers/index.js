import TweetResolvers from './tweet-resolvers';

export default {
  Query: {
    getTweets: TweetResolvers.getTweets,
  },
};
