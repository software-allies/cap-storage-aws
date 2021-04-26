import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../services/config-general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class RequestService {

  token: string = '';
  dataPost: any = {};
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private _config: ConfigService) { }


  async createFileRecord(dataFile: any, fields: any, token?: any) {

    fields.forEach((field: any) => {
      switch (field.association) {
        case 'id':
          this.dataPost[`${field.name}`] = uuidv4();
          break;
        case 'name':
          this.dataPost[`${field.name}`] = dataFile.key.split('/')[1].split('.')[0];
          break;
        case 'url':
          this.dataPost[`${field.name}`] = dataFile.Location;
          break;
        default:
          this.dataPost[`${field.name}`] = field.value;
          break;
      }
    });

    if (token !== '') {
      this.token = token;
      return await this.postRequest();
    }
  }

  postRequest() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    this.http.post(`${this._config.endpoint}`, this.dataPost, httpOptions).subscribe((response: any) => {
      Swal.fire(
        'Successful!',
        'The file has been saved.',
        'success'
      );
      return response;
    }, (error) => {
      Swal.fire(
        `${error.statusText}`,
        `${error.error.error.message}`,
        'error'
      );
      console.log('error: ', error);
      return error;
    });

  }


  async getFilesRecords(filePath: string, userId: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    this.http.get(`${this._config.endpoint}/${filePath}/${userId}`, httpOptions).subscribe((response: any) => {
      Swal.fire(
        'Successful!',
        'The file has been saved.',
        'success'
      );
      return response;
    }, (error) => {
      Swal.fire(
        `${error.statusText}`,
        `${error.error.error.message}`,
        'error'
      );
      console.log('error: ', error);
      return error;
    });
  }

  getCapFilesByFilter(filePath: string, filter: {}): Observable<Array<any>> {

    let pathRequest = `${this._config.endpoint}/${filePath}?filter=${JSON.stringify(filter)}`;
    return this.http.get<[any]>(pathRequest, this.httpOptions)
      .pipe(
        retry(2),
      )
  }
}