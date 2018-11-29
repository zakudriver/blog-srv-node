import * as Mongoose from 'mongoose';

export interface IAdminConfig extends Mongoose.Document {
  title: string;
  primaryColor: string;
  drawerColor: string;
  drawerWidth: number;
}

const AdminConfigSchema = new Mongoose.Schema(
  {
    primaryColor: {
      type: String
    },
    drawerColor: {
      type: String
    },
    title: {
      type: String
    },
    drawerWidth: {
      type: Number
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

export default Mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);
