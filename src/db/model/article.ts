import * as mongoose from 'mongoose';

export interface IArticle extends mongoose.Document {
  title: string;
  className: string;
  classId: string;
  content: string;
  createTime: string;
  updateTime: string;
}

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    className: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      required: true
    },
    content: {
      type: String
    },
    isFormal: {
      type: Boolean,
      required: true
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    updateTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default mongoose.model<IArticle>('Article', articleSchema);
