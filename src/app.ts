import express, { Application, Request, Response } from 'express';
import { userRoutes } from './routes';
import { Config } from './config';
import cors from 'cors';
import { ResponseHandler } from './handlers';
import swaggerJsDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './docs/swagger';
import path from 'path';
import http from 'http';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwaggerDoc();
  }

  private initializeSwaggerDoc() {
    const swaggerSpec = swaggerJsDoc(swaggerOptions) as SwaggerDefinition;
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: ['http://localhost:4200', 'http://localhost:3000'],
        credentials: true,
      })
    );
    this.app.use(express.json({ limit: '100mb' })); // Parse incoming JSON requests
    this.app.use(express.urlencoded({ limit: '100mb', extended: true })); // Parse URL-encoded payloads
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  private initializeRoutes() {
    // server running status check
    this.app.get(`/`, (req: Request, res: Response) => {
      ResponseHandler.success<null>(res, {
        msg: `✅ ${Config.ENV} server is running!!`,
        data: null,
      });
    });
    // user routes
    this.app.use(`${Config.USER_PREFIX}/auth`, new userRoutes.AuthRoute().router);

    // admin routes
  }

  public listen(port: number) {
    const server = http.createServer(this.app);
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  }
}

export default App;
