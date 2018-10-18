import * as mongoose from 'mongoose';

export interface IClassification extends mongoose.Document {
  name: string;
  order: number;
  createTime: string;
  updateTime: string;
}

const classificationSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    order: {
      type: Number
      // unique: true
    }
    // createTime: {
    //   type: Date,
    //   default: Date.now
    // },
    // updateTime: {
    //   type: Date,
    //   default: Date.now
    // }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default mongoose.model<IClassification>('Classification', classificationSchema);
