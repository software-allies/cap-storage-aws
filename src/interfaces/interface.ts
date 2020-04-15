export interface awsCredentials {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  folder: string;
  endpoint?: string;
}

export interface IFile {
  sizeAux?: string;
  lastModified?: number; //1571953485234
  lastModifiedDate?: any;//Thu Oct 24 2019 16:44:45 GMT-0500 (Central Daylight Time) {}
  name?: string;//"Screen Shot 2019-10-24 at 4.44.36 PM.png"
  size?: number;//486168
  type?: string;
  webkitRelativePath?: any;
  progressBar?: number;
}

export interface ISession {
  token: string;
  authId: string;
}

export interface IObjField {
  name: string;
  association: string;
  value?: any;
}