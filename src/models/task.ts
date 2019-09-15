import mongoose, { Schema, Document } from 'mongoose'

export interface Task extends Document {
  description: string;
  completed?: boolean;
}

const TaskSchema: Schema = new Schema({
  description: {
    type: String,
    required: [true, 'You must provide a description'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.model<Task>('Task', TaskSchema)
