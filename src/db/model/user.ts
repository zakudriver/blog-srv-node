import * as Mongoose from 'mongoose';

interface IUser extends Mongoose.Document {
  username: string;
  password: string;
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
    }
  },
  {
    versionKey: false
  }
);

export default Mongoose.model<IUser>('User', UserSchema);
