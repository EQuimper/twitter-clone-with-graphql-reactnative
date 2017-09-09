import mongoose, { Schema } from 'mongoose';

import Tweet from './Tweet';
import { TWEET_FAVORITED } from '../graphql/resolvers/tweet-resolvers';
import { pubsub } from '../config/pubsub';

const FavoriteTweetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  tweets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],
});

FavoriteTweetSchema.methods = {
  async userFavoritedTweet(tweetId) {
    if (this.tweets.some(t => t.equals(tweetId))) {
      this.tweets.pull(tweetId);
      await this.save();

      const tweet = await Tweet.decFavoriteCount(tweetId);

      const t = tweet.toJSON();

      pubsub.publish(TWEET_FAVORITED, { [TWEET_FAVORITED]: { ...t } });

      return {
        isFavorited: false,
        ...t,
      };
    }

    const tweet = await Tweet.incFavoriteCount(tweetId);

    const t = tweet.toJSON();

    this.tweets.push(tweetId);
    await this.save();
    pubsub.publish(TWEET_FAVORITED, { [TWEET_FAVORITED]: { ...t } });
    return {
      isFavorited: true,
      ...t,
    };
  },
};

FavoriteTweetSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('FavoriteTweet', FavoriteTweetSchema);
