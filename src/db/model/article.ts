import * as Mongoose from 'mongoose';

export interface IArticle extends Mongoose.Document {
  uid: string;
  title: string;
  className: string;
  content: string;
  createTime: string;
  updateTime: string;
  uploads?: object[];
  isFormal: boolean;
  message?: IArticleMessage[];
}

export interface IArticleMessage {
  name: string;
  email: string;
  text: string;
}

const articleSchema = new Mongoose.Schema(
  {
    uid: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    className: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Classification'
    },
    content: {
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
    message: {
      type: Array
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IArticle>('Article', articleSchema);
