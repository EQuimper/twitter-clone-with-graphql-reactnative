import Tweet from '../../models/Tweet';
import FavoriteTweet from '../../models/FavoriteTweet';
import { requireAuth } from '../../services/auth';
import { pubsub } from '../../config/pubsub';

const TWEET_ADDED = 'tweetAdded';
export const TWEET_FAVORITED = 'tweetFavorited';

export default {
  getTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.findById(_id);
    } catch (error) {
      throw error;
    }
  },
  getTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const p1 = Tweet.find({}).sort({ createdAt: -1 });
      const p2 = FavoriteTweet.findOne({ userId: user._id });
      const [tweets, favorites] = await Promise.all([p1, p2]);

      const tweetsToSend = tweets.reduce((arr, tweet) => {
        const tw = tweet.toJSON();

        if (favorites.tweets.some(t => t.equals(tweet._id))) {
          arr.push({
            ...tw,
            isFavorited: true,
          });
        } else {
          arr.push({
            ...tw,
            isFavorited: false,
          })
        }

        return arr;
      }, []);

      return tweetsToSend;
    } catch (error) {
      throw error;
    }
  },
  getUserTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.find({ user: user._id }).sort({ createdAt: -1 })
    } catch (error) {
      throw error;
    }
  },
  createTweet: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.create({ ...args, user: user._id });

      pubsub.publish(TWEET_ADDED, { [TWEET_ADDED]: tweet });

      return tweet;
    } catch (error) {
      throw error;
    }
  },
  updateTweet: async (_, { _id, ...rest }, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.findOne({ _id, user: user._id });

      if (!tweet) {
        throw new Error('Not found!');
      }

      Object.entries(rest).forEach(([key, value]) => {
        tweet[key] = value;
      });

      return tweet.save();
    } catch (error) {
      throw error;
    }
  },
  deleteTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const tweet = await Tweet.findOne({ _id, user: user._id });

      if (!tweet) {
        throw new Error('Not found!');
      }
      await tweet.remove();
      return {
        message: 'Delete Success!'
      }
    } catch (error) {
      throw error;
    }
  },
  favoriteTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const favorites = await FavoriteTweet.findOne({ userId: user._id });

      return favorites.userFavoritedTweet(_id);
    } catch (error) {
      throw error;
    }
  },
  tweetAdded: {
    subscribe: () => pubsub.asyncIterator(TWEET_ADDED)
  },
  tweetFavorited: {
    subscribe: () => pubsub.asyncIterator(TWEET_FAVORITED),
  }
};
