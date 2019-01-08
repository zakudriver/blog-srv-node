import * as Mongoose from 'mongoose';

export interface ICover extends Mongoose.Document {}

const CoverSchema = new Mongoose.Schema(
  {
    // createTime: {
    //   type: Date,
    //   default: Date.now
    // },
    // updateTime: {
    //   type: Date,
    //   default: Date.now
    // }
    cover: [
      {
        type: String,
        required: true
      }
    ]
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<ICover>('Cover', CoverSchema);
