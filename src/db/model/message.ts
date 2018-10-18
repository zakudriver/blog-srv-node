import * as mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  email: string;
  text: string;
  time: string;
}

const messageSchema = new mongoose.Schema(
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

export default mongoose.model<IMessage>('Message', messageSchema);
