import App from './App';
import UserController from './controllers/UserContoller';

new App([
  new UserController(),
], 3001).listen();
