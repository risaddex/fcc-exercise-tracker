import mongoose from 'mongoose';
import debug from 'debug';

console.log(process.env.DB_URI)
const log: debug.IDebugger = debug('app:mongoose-service');

require('dotenv').config({ path: __dirname+'/.env' });
class MongooseService {
  private count = 0;
  private mongooseOptions: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)');
    mongoose
      .connect(
        process.env.DB_URI || '',
        this.mongooseOptions
      )
      .then(() => {
        log('MongoDB is connected');
      })
      .catch((err) => {
        const retrySeconds = 5;
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
