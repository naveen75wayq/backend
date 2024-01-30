import mongoose, { Schema, model } from 'mongoose';

interface Post {
    _id: mongoose.Schema.Types.ObjectId;
    ref: string;
  }
  
  export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    posts: Post[];
    roles: {
      User: number;
      Editor?: number;
      Admin?: number;
    };
    refreshToken: string[];
  }
const UserSchema = new Schema<IUser>({
  username: {
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
  posts:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  roles: {
    User: {
        type: Number,
        default: 2001
    },
    Editor: Number,
    Admin: Number
},
refreshToken:[String]

});

const User = model<IUser>('User', UserSchema);

export default User;
