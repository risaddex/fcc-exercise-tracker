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

