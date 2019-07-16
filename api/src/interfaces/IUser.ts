export default interface IUser {
  _id?: string;
  email: string;
  password?: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  createdAt?: number;
  phoneNumber?: string;
  phoneNumberVerifiedAt?: number;
  emailVerifyCode?: string;
  emailVerifiedAt?: number;
  forgotPasswordCode?: string;
  lastChangedPasswordAt?: number;
  orgContextId?: string;
  orgRole?: string;
}
