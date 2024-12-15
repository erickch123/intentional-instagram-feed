import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICategory } from './Category';
// import {Following,IFollowing} from './Following';


export interface IFollowing {
  instagramUserID: string;
  username: string;
  fullName?: string; // Optional field
  categories: Types.ObjectId[]; // References to Category
  description: string;
}


const FollowingSchema: Schema = new Schema({
  instagramUserID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  description: {
    type: String,
    required: false,
    default: '',
  },
});

interface IUser extends Document {
  instagramUserID: string; // Required field
  fullName?: string; // Optional field
  username: string;
  followings: IFollowing[];
  categories: ICategory[];
}


const UserSchema: Schema = new Schema({
  instagramUserID: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  followings: {
    type: [FollowingSchema],
    default: [],
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
});

export default mongoose.model<IUser>('User', UserSchema);