import * as Mongoose from 'mongoose';

export interface IClassification extends Mongoose.Document {
  name: string;
  order: number;
  createTime: string;
  updateTime: string;
}

const classificationSchema = new Mongoose.Schema(
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
      type: Number,
      // unique: true
      default: 0
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

export default Mongoose.model<IClassification>('Classification', classificationSchema);
