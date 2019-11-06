import { Component, OnInit } from '@angular/core';
// import { AlertController } from 'ionic-angular';

import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'cap-upload',
  template: `
      <div class="row justify-content-md-center" *ngIf="selectedFile">
        <div class="col col-md-6" >
          <div class="card">
            <img  id="image" src="" class="card-img-top">
            <div class="card-body">
              <div class="progress my-3">
                <div class="progress-bar" role="progressbar" [style.width]="progressBar + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{progressBar}}%</div>
              </div>
             
              <div class="input-group mb-3">
                <div class="custom-file">
                  <input type="file" name="file" accept="image/*" id="file" class="custom-file-input" (change)="selectFile($event)" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" [disabled]="progressBar === 100">
                  <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                </div>  
              </div>
              <button class="btn btn-primary btn-block" [disabled]="!selectedFile || progressBar === 100" (click)="upload()">Upload</button>
              <button class="btn btn-danger btn-block" [disabled]="!isComplete" (click)="cleanData()">Clean data</button>
              
              <div class="alert alert-success my-3" role="alert" *ngIf="showAlert">
                Success upload!
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
  totalSize: any;
  progressBar: number = 0;
  selectedFile: any;
  reader = new FileReader();
  isComplete: boolean = false;
  showAlert: boolean = false;
  
  constructor(private uploadService: StorageService) { }

  ngOnInit() { }

  upload() {

    const file = this.selectedFile.item(0);
    this.uploadService.upload(file, (progress: any) => {
      this.progressBar = Math.round((progress.loaded * 100) / progress.total);
      if (progress.loaded == progress.total) {
        this.showAlert = true
        setTimeout(() => {
          this.showAlert = false
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