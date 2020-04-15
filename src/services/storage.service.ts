import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { FileUpload } from '../models/fileUploads.class';

import { ConfigService } from '../services/config-general.service';
import { RequestService } from '../services/request.service';

import { IObjField } from '../interfaces/interface';

import Swal from 'sweetalert2';

@Injectable()
export class StorageService {
  private accessKeyId: string = '';
  private secretAccessKey: string = '';
  private region: string = '';
  private bucket: string = '';
  private folder: string = '';
  private endpoint?: string = '';

  private bucketConfig: any;

  constructor(private _config: ConfigService, private requestService: RequestService) {
    this.accessKeyId = this._config.accessKeyId;
    this.secretAccessKey = this._config.secretAccessKey;
    this.region = this._config.region;
    this.bucket = this._config.bucket;
    this.folder = this._config.folder;
    if (this._config.endpoint !== undefined || this._config.endpoint !== '') {
      this.endpoint = this._config.endpoint;
    }

    this.bucketConfig = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    })
  }

  upload(file: any, fields: Array<IObjField>, credentials: any, fn: any) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };

    this.bucketConfig.upload(params, (err: any, data: any) => {
      if (err) {
        if (this.endpoint === '' && credentials.token === '') {
          console.log('There was an error uploading your file: ', err);
          Swal.fire(
            `${err.statusText} status ${err.status}`,
            `${err.message}`,
            'error'
          );
          return false;
        }
      }
      if (this.endpoint) this.requestService.createFileRecord(data, fields, credentials);
      else {
        Swal.fire(
          'Successful!',
          'The file was successfully saved!',
          'success'
        );
        return true;
      }
    }).on('httpUploadProgress', fn);
  }

  getFiles() {
    let fileUploads = new Array<FileUpload>();

    let paramsG = {
      Bucket: this.bucket,
      Prefix: this.folder
    }

    this.bucketConfig.listObjects(paramsG, (err: any, data: any) => {
      if (err) {
        console.log(`There was an error getting you files: ${err}`);
        return;
      }
      console.log('Successfully get files', data);
      const fileData = data.Contents;

      if (fileData !== undefined) {
        fileData.forEach((element: any) => {
          if (element.Key !== `${this.folder}/`) {
            fileUploads.push(new FileUpload(element.Key, `https://s3.amazonaws.com/${paramsG.Bucket}/${element.Key}`))
          }
        });
      }
    });
    return fileUploads
  }
}