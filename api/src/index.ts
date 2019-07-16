import Transcriber from './Transcriber';
import UserController from './controllers/UserContoller';

new Transcriber([
  new UserController(),
], 3001).listen();
