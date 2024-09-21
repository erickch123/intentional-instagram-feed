import mongoose, { Document, Schema } from 'mongoose';

interface IFollowing {
  username: string;
  full_name: string;
  category: string[];
  description: string;
}

interface IUser extends Document {
  name: string;
  username: string;
  followings: IFollowing[];
  categories: string[];
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
  username: {
    type: String,
    required: true,
    unique: true
},
  followings: {
    type: [FollowingSchema],
    default: [],
  },
  categories: {
    type: [String],  // Array of strings
    default: [],     // Default empty array
  },
});

export default mongoose.model<IUser>('User', UserSchema);