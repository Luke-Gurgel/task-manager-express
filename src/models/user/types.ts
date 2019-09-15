import { Model, Document } from 'mongoose'
import { Task } from '../task'

export interface Credentials {
  email: string;
  password: string;
}

export interface JwtToken {
  token: string
}

export interface PublicProfile {
  name: string;
  email: string;
  age?: number;
  avatar?: Buffer;
}

export interface UserDoc extends PublicProfile, Document {
  password: string;
  tokens: JwtToken[];
  generateJwt: () => Promise<string>
  toJSON: () => PublicProfile
  tasks: Task[]
}

export interface UserInterface extends Model<UserDoc> {
  findByCredentials: (credentials: Credentials) => Promise<UserDoc>
  generateJwt: () => Promise<string>
  toJSON: () => PublicProfile
}
