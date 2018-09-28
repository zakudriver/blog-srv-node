import * as mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  email: string;
  text: string;
  time: string;
}

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
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
