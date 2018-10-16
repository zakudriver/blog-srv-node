import * as mongoose from 'mongoose';

export interface IUpload extends mongoose.Document {
  name: string;
  url: string;
}

const uploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'time'
    }
  }
);

export default mongoose.model<IUpload>('Upload', uploadSchema);
