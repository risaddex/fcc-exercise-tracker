import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  _id:Types.ObjectId
  userId?: string;
  username?: string;
  exercises?: IExercise[];
}

export type IExercise =  {
  userId: string;
  description: String;
  duration: Number;
  date: Date;
}

export type ILogParams = {
  userId: string;
  from: Date;
  to: Date;
  limit: Number
}
