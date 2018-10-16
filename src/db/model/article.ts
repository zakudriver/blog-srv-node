import * as mongoose from 'mongoose';

export interface IArticle extends mongoose.Document {
  title: string;
  className: string;
  content: string;
  createTime: string;
  updateTime: string;
  uploads?: object[];
}

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Classification'
    },
    content: {
      type: String
    },
    uploads: [
      {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IArticle>('Article', articleSchema);
