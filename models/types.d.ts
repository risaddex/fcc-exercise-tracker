import { Types } from 'mongoose';

export interface IUser {
  userId: Types.ObjectId;
  username: string;
  exercises?: IExercise[];
}

export type IExercise =  {
  userId: string;
  description: String;
  duration: Number;
  date: string;
}

export type ILogParams = {
  userId?: string;
  from?: string;
  to?: string;
  limit?: Number
}