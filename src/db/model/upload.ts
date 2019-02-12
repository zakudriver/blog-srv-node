import * as Mongoose from 'mongoose';

export interface IUpload extends Mongoose.Document {
  name: string;
  url : string;
}

const uploadSchema = new Mongoose.Schema(
  {
    name: {
      type    : String,
      required: true
    },
    url: {
      type    : String,
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

export default Mongoose.model<IUpload>('Upload', uploadSchema);
