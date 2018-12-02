import * as Mongoose from 'mongoose';

export interface IArticle extends Mongoose.Document {
  title: string;
  category: string;
  content: string;
  createTime: string;
  updateTime: string;
  cover?: string;
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
    title: {
      type: String,
      required: true,
      unique: true
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
        type: Object
      }
    ]
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IArticle>('Article', articleSchema);
