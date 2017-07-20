import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  text: String,
}, { timestamps: true });

export default mongoose.model('Tweet', TweetSchema);
