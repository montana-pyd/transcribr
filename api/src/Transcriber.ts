import express, { Application } from 'express';
import { json } from 'body-parser';

export default class Transcriber {
  public app: Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
