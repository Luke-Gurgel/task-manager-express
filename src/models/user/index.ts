/* eslint-disable @typescript-eslint/no-use-before-define */
import mongoose, { Schema } from 'mongoose'
import { isEmail } from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Task from '../task'
import { UserDoc, UserInterface, Credentials, PublicProfile } from './types'

export const UserSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate (val: string): boolean {
      if (!isEmail(val)) {
        throw new Error('Invalid email entered')
      }
      return isEmail(val)
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, 'Password is too short'],
    validate (val: string): boolean {
      if (val.includes('password')) {
        throw new Error('Password cannot contain the word "password"')
      }
      return !val.includes('password')
    }
  },
  age: {
    type: Number,
    validate (val: number): boolean {
      if (val <= 0) throw new Error('-_- u freaggin kidding me?')
      if (val < 18) throw new Error('Must be 18 or older to sign up!')
      return true
    }
  },
  avatar: Buffer,
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

UserSchema.pre<UserDoc>('save', async function(next): Promise<void> {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
})

UserSchema.pre<UserDoc>('remove', async function(next): Promise<void> {
  await Task.deleteMany({ owner: this._id })
})

UserSchema.methods.generateJwt = async function(): Promise<string> {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
  this.tokens = [...this.tokens, { token }]
  await this.save()
  return token
}

UserSchema.methods.toJSON = function(): PublicProfile {
  const user = this.toObject()

  delete user.password
  delete user.tokens
  delete user.avatar

  return user
}

UserSchema.statics.findByCredentials = async ({ email, password }: Credentials): Promise<UserDoc> => {
  const user = await User.findOne({ email })
  if (!user) throw Error('Unable to log in')

  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (!passwordsMatch) throw Error('Unable to log in')

  return user
}

const User = mongoose.model<UserDoc, UserInterface>('User', UserSchema)
export default User
