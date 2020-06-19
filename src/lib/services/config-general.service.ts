import { Injectable, Optional } from '@angular/core';
import { awsCredentials } from '../interfaces/interface';
@Injectable()

export class ConfigService {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  folder: string;
  endpoint?: string;

  constructor(@Optional() config: awsCredentials) {
    if (config) {
      this.bucket = config.bucket;
      this.accessKeyId = config.accessKeyId;
      this.secretAccessKey = config.secretAccessKey;
      this.region = config.region;
      this.folder = config.folder;
      if (config.endpoint !== undefined || config.endpoint !== '') {
        this.endpoint = config.endpoint;
      };
    }
  }
}
