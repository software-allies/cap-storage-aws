import { Injectable, Optional } from '@angular/core';

export interface IConfigService{
     bucket: string;
     accessKeyId: string;
     secretAccessKey: string;
     region: string;
     folder: string;
}

@Injectable()

export class ConfigService {
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    folder: string;
    
    constructor(@Optional() config: IConfigService) {
        if (config) {
            this.bucket = config.bucket;
            this.accessKeyId = config.accessKeyId;
            this.secretAccessKey = config.secretAccessKey;
            this.region = config.region;
            this.folder = config.folder;
        }
    }
}