import mongoose, { Schema } from 'mongoose';

const FollowingUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  followings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

FollowingUserSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('FollowingUser', FollowingUserSchema);