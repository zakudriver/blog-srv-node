import * as Mongoose from 'mongoose';

export interface IUser extends Mongoose.Document {
  username: string;
  password: string;
  avatar: string;
  privilege: number;
}

const UserSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    privilege: {
      type: Number,
      required: true
    }
    // createTime: {
    //   type: Date,
    //   default: Date.now
    // },
    // updateTime: {
    //   type: Date,
    //   default: Date.now
    // }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IUser>('User', UserSchema);
