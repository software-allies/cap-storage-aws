import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IDbFields, ILocalStorage } from '../../interfaces/interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'cap-upload',
  template:
    `
      <simple-notifications [options]="options"></simple-notifications>

      <div class="row justify-content-md-center" *ngIf="selectedFile">
        <div class="col col-md-6">
          <div class="card">
            <img id="image" src="" class="card-img-top">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="progress my-3">
                    <div class="progress-bar" role="progressbar" [style.width]="progressBar + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{progressBar}}%</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="input-group mb-3">
                    <div class="custom-file">
                        
                      <input type="file" name="file" accept="image/*" id="file" class="custom-file-input" (change)="selectFile($event)" id="file" aria-describedby="inputGroupFileAddon01" [disabled]="progressBar === 100">
                      <label class="custom-file-label" for="file">Choose file</label>
                    </div>  
                  </div>
                  <button class="btn btn-primary btn-block" [disabled]="!selectedFile || progressBar === 100" (click)="upload()">Upload</button>
                  <button class="btn btn-danger btn-block" [disabled]="!isComplete" (click)="cleanData()">Clean data</button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-center" *ngIf="!selectedFile">
        <div class="col col-md-6">
          <div class="card">
            <div class="imageNotFound">Photo</div>
              <div class="card-body">
                <div class="custom-file my-3">
                  <input type="file" class="custom-file-input" name="file" accept="image/*" id="file" (change)="selectFile($event)">
                  <label class="custom-file-label" for="customFile">Choose file</label>
                </div>
                <button class="btn btn-primary btn-block" [disabled]="!selectedFile" (click)="upload()">Upload</button>
                
              </div>
          </div>
        </div>
      </div>
    `,
  styles: [
    `
      .imageNotFound {
        background-color: gray;
        width: 100%;
        height: 300px;
        color: gray;
      }
    `
  ]
})

export class CapFileUploadComponent implements OnInit {
  @Input() token: string = '';
  @Input() fields: IDbFields[] = [];
  @Input() localStorageRef: ILocalStorage = {
    key: '',
    reference: ''
  };

  totalSize: any;
  progressBar: number = 0;
  selectedFile: any;
  reader = new FileReader();
  isComplete: boolean = false;

  tokenRef: string;

  constructor(private uploadService: StorageService) {

  }

  ngOnInit() {
    if (this.localStorageRef.key !== '') {
      // Saving the information into the dataLS variable (Data LocalStorage)
      let dataLS: any = localStorage.getItem(`${this.localStorageRef.key}`);

      // Converting the response into the objLocal (objectLocal) that makes references 
      // to the Data from the local storage
      let objLocal = JSON.parse(dataLS);

      // Saving the token into the variable token
      this.tokenRef = objLocal[`${this.localStorageRef.reference}`];
    } else {
      if (this.token.length > 0) {
        this.tokenRef = this.token;
      }
    }
  }

  upload() {

    const file = this.selectedFile.item(0);
    this.uploadService.upload(file, this.fields, this.tokenRef, (progress: any) => {
      this.progressBar = Math.round((progress.loaded * 100) / progress.total);
    });
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files;
    this.reader.onload = (event: any) => {
      const image: any = document.getElementById("image");
      image.src = event.target.result;
    }
    const f = event.target.files[0];
    this.reader.readAsDataURL(f);
  }

  cleanData() {
    this.selectedFile = null;
    this.progressBar = 0;
    this.isComplete = false
  }

}