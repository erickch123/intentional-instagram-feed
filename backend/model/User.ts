import mongoose, { Document, Schema } from 'mongoose';

interface IFollowing {
  username: string;
  full_name: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  followings: IFollowing[];
}

const FollowingSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: false,
  },
  category: {
    type: [String],  // Array of strings where users define their own categories
    required: false,
    default: [],
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
});

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followings: {
    type: [FollowingSchema],
    default: [],
  },
});

export default mongoose.model<IUser>('User', UserSchema);