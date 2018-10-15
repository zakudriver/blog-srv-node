import * as mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  email: string;
  text: string;
  time: string;
}

const messageSchema = new mongoose.Schema(
  {
    url: {
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
