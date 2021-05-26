import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../services/config-general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { retry } from "rxjs/operators";
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


  createFileRecord(dataFile: any, fields: any, token?: any) {
    fields.forEach((field: any) => {
      switch (field.referenceTo) {
        case 'id':
          this.dataPost[`${field.propertyName}`] = uuidv4();
          break;
        case 'name':
          this.dataPost[`${field.propertyName}`] = dataFile.Key.split('/')[1];
          break;
        case 'url':
          this.dataPost[`${field.propertyName}`] = dataFile.Location;
          break;
        default:
          this.dataPost[`${field.propertyName}`] = field.value;
          break;
      }
    });
    if (token !== '' || token !== null) {
      this.token = token;
      // let gg = await this.postRequest();
      return this.postRequest();
    }
  }

  postRequest() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.post(`${this._config.endpoint}`, this.dataPost, httpOptions)
    // this.http.post(`${this._config.endpoint}`, this.dataPost, httpOptions).subscribe((response: any) => {
    //   Swal.fire(
    //     'Successful!',
    //     'The file has been saved.',
    //     'success'
    //   );
    //   console.log('response: ', response);
    //   return response;
    // }, (error) => {
    //   Swal.fire(
    //     `${error.statusText}`,
    //     `${error.error.error.message}`,
    //     'error'
    //   );
    //   return error;
    // });
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

  getCapFilesByFilter(filter: {}): Observable<Array<any>> {
    let pathRequest = `${this._config.endpoint}?filter=${JSON.stringify(filter)}`;
    return this.http.get<[any]>(pathRequest, this.httpOptions)
      .pipe(
        retry(2),
      )
  }


  async deleteRecord(file: any) {
    this.http.delete(`${this._config.endpoint}/${file.id}`).subscribe((response: any) => {
      Swal.fire(
        'Successful!',
        'The file has been deleted.',
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
}