export default interface IFile {
  _id?: string;
  name: string;
  url: string;
  text: string;
  encoding: string;
  languageCode: string;
  sampleRateHertz: number;
  startedAt: number;
  endedAt: number;
}
