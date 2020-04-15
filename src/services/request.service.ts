import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../services/config-general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';

import Swal from 'sweetalert2';


@Injectable({ providedIn: 'root' })
export class RequestService {

  constructor(private http: HttpClient, private _config: ConfigService, private _toast: NotificationsService) {}

  createFileRecord(dataFile: any, fields: any, credentials?: any) {
    let dataPost: any = {};
    fields.forEach((field: any) => {
      switch (field.association) {
        case 'id':
          dataPost[`${field.name}`] = uuidv4();
          break;
        case 'name':
          dataPost[`${field.name}`] = dataFile.key.split('/')[1].split('.')[0];
          break;
        case 'url':
          dataPost[`${field.name}`] = dataFile.Location;
          break;
        default:
          dataPost[`${field.name}`] = field.value;
          break;
      }
    });

    if(credentials.token !== ''){
      const httpOptions = {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          'Authorization': `Bearer ${credentials.token}`
        })
      };
      this.http.post(`${this._config.endpoint}`, dataPost, httpOptions).subscribe((data: any) => {
        Swal.fire(
          'Successful!',
          'The information was successfully saved!',
          'success'
        );
        return data
      }, (error) => {
        console.log(error);
        Swal.fire(
          `${error.statusText} status ${error.status}`,
          `${error.message}`,
          'error'
        );
        return error;
      });
    }
  }
}