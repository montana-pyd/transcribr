import { Document, Schema, Model, model, connect } from 'mongoose';
import IPaymentInfo from './../interfaces/IPaymentInfo';
import {
  MONGO_DB_HOST,
  MONGO_DB_PORT,
} from './../env';

export interface IPaymentInfoModel extends IPaymentInfo, Document {
  _id: string,
}

const PaymentHistory = {
  _id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  created: {
    type: Number,
    required: true,
  },
}

export const PaymentInfoSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: false,
  },
  paymentHistory: [PaymentHistory]
});

export const PaymentInfo: Model<IPaymentInfoModel> = model<IPaymentInfoModel>('PaymentInfo', PaymentInfoSchema);

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


