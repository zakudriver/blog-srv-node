import * as mongoose from 'mongoose';

export interface IClassification extends mongoose.Document {
  className: string;
  order: number;
  createTime: string;
  updateTime: string;
}

const classificationSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      unique: true,
      required: true
    },
    order: {
      type: Number,
      // unique: true
    },
    createTime: {
      type: String,
      default: Date.now
    },
    updateTime: {
      type: String,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default mongoose.model<IClassification>('Classification', classificationSchema);
