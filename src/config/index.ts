import dotenv from 'dotenv';
dotenv.config();

export class Config {
  public static USER_PREFIX: string = '/api/v1/users';
  public static ADMIN_PREFIX: string = '/api/v1/admins';
  public static ENV: string = process.env.ENV || '';
  public static JWT_SECRET: string = process.env.JWT_SECRET || '';
  public static JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || '';
  public static MONGO_DB_URI: string = process.env.MONGO_DB_URI || '';
  public static AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || '';
  public static AWS_REGION: string = process.env.AWS_REGION || '';
  public static AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || '';
  public static AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME || '';
  public static STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY || '';
  public static STRIPE_WEBHOOK_KEY: string = process.env.STRIPE_WEBHOOK_KEY || '';
  public static PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  public static EMAIL_HOST: string = process.env.EMAIL_HOST || '';
  public static EMAIL_PORT: number = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 0;
  public static EMAIL_FROM: string = process.env.EMAIL_FROM || '';
  public static EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || '';
  public static ZOOM_CLIENT_ID: string = process.env.ZOOM_CLIENT_ID || '';
  public static ZOOM_CLIENT_SECRET: string = process.env.ZOOM_CLIENT_SECRET || '';
  public static ZOOM_ACCOUNT_ID: string = process.env.ZOOM_ACCOUNT_ID || '';
  public static OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || '';
}
