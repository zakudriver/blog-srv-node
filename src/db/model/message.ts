import * as Mongoose from 'mongoose';

export interface IMessage extends Mongoose.Document {
  uid: string;
  email: string;
  text: string;
  time: string;
}

const messageSchema = new Mongoose.Schema(
  {
    name: {
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
    },
    article:{
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Article'
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
