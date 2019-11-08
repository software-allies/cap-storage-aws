import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { StorageService } from '../../services/storage.service';

export interface IFile {
  sizeAux?: string;
  lastModified?: number; //1571953485234
  lastModifiedDate?: any;//Thu Oct 24 2019 16:44:45 GMT-0500 (Central Daylight Time) {}
  name?: string;//"Screen Shot 2019-10-24 at 4.44.36 PM.png"
  size?: number;//486168
  type?: string;
  webkitRelativePath?: any;
  progressBar?: number;
}

@Component({
  selector: 'cap-upload-drag-drop',
  template:
    `
      <div class="row justify-content-md-center">
        <div class="col col-md-8">
          <div class="center">
            <ngx-file-drop 
              dropZoneLabel="Drop files here" 
              (onFileDrop)="dropped($event)" 
              (onFileOver)="fileOver($event)" 
              (onFileLeave)="fileLeave($event)">
                <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
                  <p class="m-3"> Drop files here</p>
                  <strong class="m-3">or</strong>
                  <button type="button" class="btn btn-primary m-3" (click)="openFileSelector()">Browse Files</button>
                </ng-template>
            </ngx-file-drop>
          
          </div>
        </div>
      </div>

      <div class="row justify-content-md-center mt-5" *ngIf="filesNFormat.length > 0">
        <div class="col-12 col-md-8">
        <div class="table-responsive-sm">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Size</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let file of filesNFormat; let i of index">
                <td >{{file.name}}</td>
                <td >{{file.sizeAux}}</td>
                <td width="250px;">
                  <div class="progress">
                    <div class="progress-bar" [ngClass]="{'bg-success' : file.progressBar === 100 }" role="progressbar" [style.width]="file.progressBar + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{file.progressBar}}%</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

export class CapFileUploadDragDropComponent implements OnInit {
  reader = new FileReader();
  filesNFormat: IFile[] = [];
  public files: NgxFileDropEntry[] = [];

  constructor(private uploadService: StorageService) { }

  ngOnInit() { }

  upload(file: any) {
    this.uploadService.upload(file, (progress: any) => {
      file.progressBar = Math.round((progress.loaded * 100) / progress.total);
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.filesNFormat = []
    this.files = files;

    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        let fileToUpload: IFile;
        fileEntry.file((file: File) => {

          fileToUpload = file;
          fileToUpload.progressBar = 0;
          fileToUpload.sizeAux = this.formatFileSize(fileToUpload.size)
          console.log('fileToUpload: ', fileToUpload);
          if (fileToUpload !== undefined) {
            this.filesNFormat.push(fileToUpload)
          }

          this.upload(fileToUpload)

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  formatFileSize(bytes: any, decimalPoint?: any) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}