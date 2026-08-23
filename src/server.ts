import App from './app';
import { Config } from './config';
import { connectDB } from './utils/db';
import { IUser } from './models';
import { IAuthAccessTokenPayload } from './interfaces/IAuthAccessTokenPayload';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: IAuthAccessTokenPayload;
      user?: IUser | null;
    }
  }
}

// connect to MongoDB
connectDB();

const app = new App();

app.listen(Config.PORT);
