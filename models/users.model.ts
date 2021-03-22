import debug from 'debug'
import { SchemaOptions, Model } from 'mongoose'
import mongooseService from '../services/mongooseService'
import { IExercise } from './types';

const log: debug.IDebugger = debug('app:user-model')

class User {
  options: SchemaOptions = {
    versionKey: false,
  }

  Schema = mongooseService.getMongoose().Schema

  userSchema = new this.Schema(
    {
      username: String,
      exercises: [
        new this.Schema(
          {
            description: String,
            duration: Number,
            date: Date ||String
          },
          { _id: false }
        ),
      ],
    },
    this.options
  )

  User = mongooseService.getMongoose().model('Users', this.userSchema)

  constructor() {
    log('Created new instance of User')
  }

  async getLogsById(userId: string | string[]) {
    return await this.User.findById(userId)
      .select('_id username exercises')
      .exec()
      // @ts-ignore
      .then(({ _doc: { exercises: logs, username, _id } }) => {
        return { _id, username, count: logs.length, logs }
      })
      .catch((err) => log(err))
  }

  async addUser(username: string) {
    const user = new this.User({ username: username })
    await user
      .save()
      .then(() => log('user saved'))
      .catch((err) => `fail to save user: ${err}`)
    return user
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec()
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select('_id email permissionLevel +password')
      .exec()
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec()
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate('User').exec()
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .select({ _id: 1, username: 1 })
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async addExercise({ userId, ...exerciseInfo }: IExercise) {
    return await this.User.findByIdAndUpdate(
      userId,
      {
        $push: {
          exercises: exerciseInfo,
        },
      },

      { new: true }
    )
      .exec()
      // @ts-ignore
      .then(({ _id, username }: { _id: string; username: string }) => {
        return {
          _id,
          username,
          date: exerciseInfo.date,
          duration: Number(exerciseInfo.duration),
          description: exerciseInfo.description,
        }
      })
  }

  // async updateUserById(
  //   userId: string,
  //   userFields: PatchUserDto | PutUserDto
  // ) {
  //   const existingUser = await this.User.findOneAndUpdate(
  //     { _id: userId },
  //     { $set: userFields },
  //     { new: true }
  //   ).exec();

  //   return existingUser;
  // }
}

export default new User()
