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
    isFormal: {
      type: Boolean,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IArticle>('Article', articleSchema);
