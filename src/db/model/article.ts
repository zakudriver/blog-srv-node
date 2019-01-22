import * as Mongoose from 'mongoose';
import { IUpload } from './upload';
import { IMessage } from './message';

export interface IArticle extends Mongoose.Document {
  title: string;
  category: string;
  content: string;
  createTime: string;
  updateTime: string;
  cover: string;
  uploads?: IUpload[];
  isFormal: boolean;
  message?: IMessage[];
}

const articleSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
    },
    content: {
      type: String
    },
    cover: {
      type: String
    },
    uploads: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Upload'
      }
    ],
    read: {
      type: Number,
      default: 0,
      required: true
    },
    isFormal: {
      type: Boolean,
      required: true
    },
    message: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IArticle>('Article', articleSchema);
