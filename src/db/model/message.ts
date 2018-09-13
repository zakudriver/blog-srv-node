import * as mongoose from 'mongoose'

interface IMessage extends mongoose.Document {
  email: string
  time: string
  text: string
}

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true,
      default: Date.now
    },
    text: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'time'
    }
  }
)

export default mongoose.model<IMessage>('Message', messageSchema)
