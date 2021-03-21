import debug from 'debug';
import mongooseService from '../services/mongooseService';
const log: debug.IDebugger = debug('app:user-model');

class User {
  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema({
    username: String,
  });

  User = mongooseService.getMongoose().model('Users', this.userSchema);

  constructor() {
    log('Created new instance of User');
  }

  async addUser(username: string) {
    const user = new this.User({ username: username });
    await user
      .save()
      .then(() => log('user saved'))
      .catch((err) => `fail to save user: ${err}`);
    return user;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select('_id email permissionLevel +password')
      .exec();
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate('User').exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
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

export default new User();
