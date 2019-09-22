import IPaymentHistory from './IPaymentHistory';

export default interface IPaymentInfo {
  _id?: string;
  userId: string;
  balance: number;
  paymentHistory: IPaymentHistory[];
}
