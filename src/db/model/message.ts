import * as Mongoose from 'mongoose';

export interface IMessage extends Mongoose.Document {
  uid: string;
  email: string;
  text: string;
  time: string;
}

const messageSchema = new Mongoose.Schema(
  {
    uid: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'time'
    }
  }
);

export default Mongoose.model<IMessage>('Message', messageSchema);
