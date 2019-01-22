import * as Mongoose from 'mongoose';

export interface IFrontConfig extends Mongoose.Document {
  avatar: string;
  name: string;
  profile: string;
  description: string;
  cover: {
    home: string;
    blog: string;
  };
  articleCover: string[];
}

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
    profile: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    cover: {
      home: {
        type: String,
        required: true
      },
      blog: {
        type: String,
        required: true
      }
    },
    articleCover: [
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

export default Mongoose.model<IFrontConfig>('FrontConfig', FrontConfigSchema);
