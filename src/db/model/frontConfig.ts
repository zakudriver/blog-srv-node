import * as Mongoose from 'mongoose';

export interface IFrontConfig extends Mongoose.Document {}

const FrontConfigSchema = new Mongoose.Schema(
  {
    avatar: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  }
);

export default Mongoose.model<IFrontConfig>('FrontConfig', FrontConfigSchema);
