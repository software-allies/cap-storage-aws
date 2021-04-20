import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAWSFileList, IDbFields, ILocalStorage } from '../../interfaces/interface';
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '../../services/config-general.service';
import { NgxSpinnerService } from "ngx-spinner";
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'cap-upload-button',
  template: `
  <div class="files-upload__container">
      <h4>
        Attachments
      </h4>
      <div>
        Payroll receipts, .xml, .doc, .pdf
      </div>

      <div class="file__list--empty" *ngIf="listFiles.length === 0">
        You don't have saved
      </div>

      <div *ngIf="listFiles.length > 0">
        <div class="file__list" *ngFor="let file of listFiles | paginate: { itemsPerPage: 5, currentPage: p }" >
          <div class="file__container">
            <div class="file__info">
              <div class="file-icon"><i class="bi bi-file-earmark-bar-graph"></i></div>
              <label class="file__name">{{file.name}}</label>
            </div>
            <div class="file__options">
              <button class="btn file__btn" (click)="showPdf(file.url)"><i class="bi bi-eye" data-toggle="modal" data-target="#exampleModal"></i></button>
              <a type="button" class="btn file__btn--link" href="{{ file.url }}" ><i class="bi bi-cloud-arrow-down-fill"></i></a>
              <button class="btn file__btn" (click)="upload()"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
        <div class="file__pagination">
          <pagination-controls (pageChange)="p = $event"></pagination-controls>
        </div>
      </div>
      <div class="upload__container">
        <img id="image" src="" class="file__visor">
        <input type="file" class="input__file" accept=".pdf, .xml, .doc, .jpg" name="file" id="file"
          (change)="selectFile($event)">
        <label class="btn upload__button" for="file">Upload file</label>
      </div>
    </div>

  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    Launch demo modal
  </button>

  <ngx-spinner
    bdColor="rgba(0, 0, 0, 0.8)" 
    size="large" 
    color="#fff" 
    type="ball-spin" 
    [fullScreen]="true">
      <p class="spinner" > Uploading file... </p>
  </ngx-spinner>
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
      hi
        <pdf-viewer [src]="pdfSrc" [render-text]="true" [original-size]="false"></pdf-viewer>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  
  
  `]
})

export class CapFileUploadButtonComponent implements OnInit {
  // Inputs
  @Input() fileUploaded?: string = 'upload';
  @Input() listFiles: IAWSFileList[] = [];
  @Input() token: string = '';
  @Input() fields: IDbFields[] = [];
  @Input() localStorageRef: ILocalStorage = {
    key: '',
    reference: ''
  };
  
  // Outputs
  @Output() dataFile = new EventEmitter<any>();
  @Output() dataFileError = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();

  bucketConfig: any;
  private accessKeyId: string = '';
  private secretAccessKey: string = '';
  private region: string = '';
  private bucket: string = '';
  private folder: string = '';
  private endpoint?: string = '';

  pdfSrc: string = '';
  selectedFile: any;
  reader = new FileReader();
  progressBar: number = 0;

  p: number = 1;
  public loading = false;

  constructor(private _config: ConfigService, private spinner: NgxSpinnerService, private requestService: RequestService) {
    this.accessKeyId = this._config.accessKeyId;
    this.secretAccessKey = this._config.secretAccessKey;
    this.region = this._config.region;
    this.bucket = this._config.bucket;
    this.folder = this._config.folder;

    this.bucketConfig = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    })

  }

  ngOnInit() {

  }

  async upload() {
    this.spinner.show();
    const file = this.selectedFile.item(0);
    const params = {
      Bucket: this.bucket,
      Key: `${this.folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };
    this.bucketConfig.upload(params, (err: any, data: any) => {
      if (err) {
        this.dataFileError.emit(err);
        this.loading = false;
        console.log('There was an error uploading your file: ', err);
        this.spinner.hide();
        return false;
      }

      this.dataFile.emit(data);
      let fileData = {
        url: data.Location,
        name: data.key,
      }
      this.listFiles.push(fileData);
      if (this.endpoint) await this.requestService.createFileRecord(data, fields, token);
    }).on('httpUploadProgress', (progress: any) => {

      this.progressBar = Math.round((progress.loaded * 100) / progress.total);
      if (progress.loaded == progress.total) {
        this.loading = false;
        setTimeout(() => {
          this.spinner.hide();
          // this.uploadService.IAWSFileObject
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

    this.upload()
  }

  showPdf(src: any) {
    let file = new Blob([src]);
    this.pdfSrc = URL.createObjectURL(file);
  }

  request() {

  }


}