import { Document, Schema, Model, model, connect } from 'mongoose';
import IUser from './../interfaces/IUser';
import {
  MONGO_DB_HOST,
  MONGO_DB_PORT,
} from './../env';


export interface IUserModel extends IUser, Document {
  _id: string,
}

export const UserSchema  = new Schema({
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: false,
    default: null,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  phoneNumberVerifiedAt: {
    type: Number,
    required: false,
    default: '',
  },
  emailVerifyCode: {
    type: String,
    required: false,
    default: null,
  },
  emailVerifiedAt: {
    type: Number,
    required: false,
    default: null,
  },
  forgotPasswordCode: {
    type: String,
    required: false,
    default: null,
  },
  lastChangedPasswordAt: {
    type: Number,
    required: false,
    default: null
  },
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

connect(`mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/admin`, {
  useNewUrlParser: true,
})
.then(() => {
  console.log('Connected to MongoDB...');
})
.catch(e => {
  console.error('There was an error connecting to MongoDB:');
  console.error(e);
});


