
export interface awsCredentials {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  folder: string;
  endpoint?: string;
};

export interface IFile {
  sizeAux?: string;
  lastModified?: number; //1571953485234
  lastModifiedDate?: any;//Thu Oct 24 2019 16:44:45 GMT-0500 (Central Daylight Time) {}
  name?: string;//"Screen Shot 2019-10-24 at 4.44.36 PM.png"
  size?: number;//486168
  type?: string;
  webkitRelativePath?: any;
  progressBar?: number;
};

/**
  * IDbFields save the fields that it's going to save the data related with the AWS file.
  * @param name Field's name.
  * @param association association's type. It could be 'id', 'name', 'url' or 'none'.
  * @param value? Value or the field that has 'none' association.
*/
export interface IDbFields {
  name: string;
  association: string;
  value?: any;
};

/**
  * LocalStorage interface.
  * @param key Name of the object that makes references to yout localStorage Data
  * @param reference Name of the property that contains the token 
*/
export interface ILocalStorage {
  key: string;
  reference: string;
};

export interface IAWSFile {
  Bucket: string;
  ETag: string;
  Key: string;
  Location: string;
  key: string;
}

export interface IAWSFileList {
  id?: string;
  url: string;
  name: string;
  Bucket?: string;
  ETag?: string;
  Key?: string;
  Location?: string;
  key?: string;
}

export interface Ifilter {
  property: string,
  value: string
}

export interface IFilterBy {
  filters: Ifilter[];
}

export interface IReferences {
  propertyName: string,
  referenceTo: string,
  value?: string
}