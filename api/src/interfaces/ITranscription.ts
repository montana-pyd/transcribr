import IFile from './IFile';

export default interface ITranscription {
  _id?: string;
  userId: string;
  name: string;
  files: IFile[];
  createdAt: number;
  cost: number;
}
