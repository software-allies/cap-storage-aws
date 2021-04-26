import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAWSFileList, IDbFields, ILocalStorage, IFilterBy, awsCredentials, IReferences, Ifilter } from '../../interfaces/interface';
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '../../services/config-general.service';
import { NgxSpinnerService } from "ngx-spinner";
import { RequestService } from '../../services/request.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

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
        You don't have files saved
      </div>

      <div *ngIf="listFiles.length > 0">
        <div class="file__list" *ngFor="let file of listFiles | paginate: { itemsPerPage: 5, currentPage: p }" >
          <div class="file__container">
            <div class="file__info">
              <div class="file-icon"><i class="bi bi-file-earmark-bar-graph"></i></div>
              <label class="file__name">{{file.name}}</label>
            </div>
            <div class="file__options">
              <button class="btn file__btn" (click)="showPdf(file.url)"><i class="bi bi-eye" id="open-button"></i></button>
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

  <button type="button" class="btn btn-primary" id="open-button">
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
  
  

  <button (click)="htmlInsideModal.open()">Raw HTML inside modal</button>
<modal #htmlInsideModal>
  <ng-template #modalHeader><h2>HTML inside modal</h2></ng-template>
  <ng-template #modalBody>
  <ngx-doc-viewer [url]="fileURL" viewer="google" style="width:100%;height:50vh;"></ngx-doc-viewer>

  </ng-template>
</modal>
  `,
  styles: [`

  `]
})

export class CapFileUploadButtonComponent implements OnInit {
  // Inputs
  @Input() fileUploaded?: string = 'upload';
  @Input() token: string = '';
  @Input() fields: IDbFields[] = [];
  @Input() localStorageRef: ILocalStorage;
  @Input() userID: string = 'null';
  @Input() queryFilters: Ifilter[] = [];

  // It's going to recive the fields that are related with the name and the url of the file
  @Input() fieldsReference: IReferences[];
  @Input() resourcesURLPath: string;

  // Outputs
  @Output() dataFile = new EventEmitter<any>();
  @Output() dataFileError = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();

  private bucketConfig: any;
  private accessKeyId: string = '';
  private secretAccessKey: string = '';
  private region: string = '';
  private bucket: string = '';
  private folder: string = '';
  private endpoint?: string = '';

  fileURL: string = '';
  selectedFile: any;
  reader = new FileReader();
  progressBar: number = 0;
  listFiles: IAWSFileList[];


  p: number = 1;
  public loading = false;

  constructor(
    private _config: ConfigService,
    private spinner: NgxSpinnerService,
    private requestService: RequestService) {

    this.getConfigValues(this._config);




  }

  // Get reference to all the object related with the AWS S3 credentials 
  private getConfigValues(config: awsCredentials) {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
    this.bucket = config.bucket;
    this.folder = config.folder;

    this.bucketConfiguration();

  }

  // Configuring s3 bucket's
  private bucketConfiguration() {
    this.bucketConfig = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    })
  }
  ngOnChanges() {
    if (this.resourcesURLPath || this.resourcesURLPath !== '') {
      this.loadFilesToList(this.queryFilters, this.fieldsReference);
    }
  }


  ngOnInit() {

    // this.getModalReference();


  }


  private async loadFilesToList(filters: Ifilter[], reference: IReferences[]) {
    console.log('reference: ',typeof reference);
    console.log('filters: ', typeof filters);
    const newObject = Object.assign({}, ...filters.map(filter => ({ [filter.property]: filter.value })));
    console.log('newObject: ', newObject);
    const dbField = Object.assign({}, ...reference.map(object => ({ [object.propertyName]: object.referenceTo })));
    console.log('dbField: ', dbField);
    // let fileElements: any = await this.getFieldsFromApi({ where: { ...newObject } })

    // this.listFiles = [{ name: '', url: '' }]


  }

  private getFieldsFromApi(filter: object) {

    return this.resourcesURLPath ? this.requestService.getCapFilesByFilter(this.resourcesURLPath, filter)
      .toPromise()
      .then((file: [any]) => file)
      .catch(error => null) : console.log('You are not using a file path');
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

    this.uploadFilesToS3(params);

  }

  private uploadFilesToS3(params: any) {
    this.bucketConfig.upload(params, async (err: any, data: any) => {
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
      if (this.endpoint) await this.requestService.createFileRecord(data, this.fields, this.token);
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

  private selectFile(event: any) {
    this.getCurrentFile(event);
    this.upload()
  }

  private getCurrentFile(event: any) {
    this.selectedFile = event.target.files;
    this.reader.onload = (event: any) => {
      const image: any = document.getElementById("image");
      image.src = event.target.result;
    }
    const f = event.target.files[0];
    this.reader.readAsDataURL(f);
  }

  private showPdf(src: any) {
    this.fileURL = src;
  }
}