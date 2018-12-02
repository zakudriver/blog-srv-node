import * as Mongoose from 'mongoose';

export interface ICategory extends Mongoose.Document {
  name: string;
  order: number;
  createTime: string;
  updateTime: string;
}

const categorySchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    order: {
      type: Number,
      // unique: true
      default: 0
    },
    // color: {
    //   type: String,
    //   required: true,
    //   default: '#333'
    // }
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

export default Mongoose.model<ICategory>('Category', categorySchema);
