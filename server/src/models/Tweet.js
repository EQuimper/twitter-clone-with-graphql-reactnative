import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  text: String,
});

export default mongoose.model('Tweet', TweetSchema);
