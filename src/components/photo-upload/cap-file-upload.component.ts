import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IDbFields, ILocalStorage } from '../../interfaces/interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'cap-upload',
  template:
    `
      


      <section class="upload-section">
        <div class="upload__image--height" *ngIf="!selectedFile">
            
          </div>
        <div class="upload__image" *ngIf="selectedFile">
          <img 
            id="image"
            src=""
            alt="" 
            class="image__element">
        </div>
  
        <div class="progress">
          <div class="progress__bar" [style.width]="progressBar + '%'">
            <span class="percentage">{{progressBar}}%</span>
          </div>
        </div>

        <br>

        <div class="progress">
          <span class="percentage--lite">{{progressBar}}%</span>
          <div class="progress__bar--lite" [style.width]="progressBar + '%'">
          </div>
        </div>

        <br>

        <input 
          class="upload__input"
          type="file"
          name="file" 
          accept="image/*" 
          id="file" 
          (change)="selectFile($event)" 
          [disabled]="progressBar === 100">
  
        <div class="upload__actions">
          <button 
            href="#" 
            class="btn btn--blue u-full-width u-center-text u-margin-bottom-small"
            [disabled]="!selectedFile || progressBar === 100" 
            (click)="upload()">Upload file</button>
          <button 
            href="#" 
            class="btn btn--red u-full-width u-center-text" 
            [disabled]="!isComplete" 
            (click)="cleanData()">Clear section</button>
        </div>

    </section>

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
      if (progress.loaded == progress.total) {
        setTimeout(() => {
          this.isComplete = true
        }, 2000)
      }
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