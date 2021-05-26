import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as S3 from 'aws-sdk/clients/s3';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { IAWSFileList, ILocalStorage, awsCredentials, IReferences, Ifilter } from '../../interfaces/interface';

import { ConfigService } from '../../services/config-general.service';
import { RequestService } from '../../services/request.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { createVerify } from 'crypto';

@Component({
  selector: 'cap-upload-button',
  template: `
  <div class="files-upload__container">
      <h4>
        Attachments
      </h4>
      <div>
        Payroll receipts, {{typeOfFiles}}
      </div>

      <div class="file__list--empty" *ngIf="listFiles.length === 0">
        You don't have files saved
      </div>

      <div class="list-container">
        <div *ngIf="listFiles.length > 0">
          <div class="file__list" *ngFor="let file of listFiles | paginate: { itemsPerPage: 5, currentPage: p }" >
            <div class="file__container">
              <div class="file__info">
                <div class="file-icon"><i class="bi bi-file-earmark-bar-graph"></i></div>
                <label class="file__name">{{file.name}}</label>
              </div>
              <div class="file__options">
                <button class="btn file__btn" (click)="showContent(file)"><i class="bi bi-eye" id="open-button"></i></button>
                <a type="button" class="btn file__btn--link" href="{{ file.url }}" ><i class="bi bi-cloud-arrow-down-fill"></i></a>
                <button class="btn file__btn" (click)="showConfirmation(file)"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
          <div class="file__pagination">
            <pagination-controls (pageChange)="p = $event"></pagination-controls>
          </div>
        </div>
      </div>
      <div class="upload__container">
        <img id="image" src="" class="file__visor">
        <input type="file" class="input__file" [accept]="typeOfFiles" name="file" id="file"
          (change)="selectFile($event)">
        <label class="btn upload__button" for="file">Upload file</label>
      </div>
    </div>

  <ngx-spinner
    bdColor="rgba(0, 0, 0, 0.8)" 
    size="large" 
    color="#fff" 
    type="ball-spin" 
    [fullScreen]="true">
      <p class="spinner" > Uploading file... </p>
  </ngx-spinner>
  
  <ngx-smart-modal #pdfPreview identifier="pdfPreview">
    <img class="image" [src]="fileURL" *ngIf="isAnImage else pdfVisor">

    <ng-template #pdfVisor>
      <ngx-doc-viewer [url]="fileURL" viewer="google" style="width:100%;height:80vh;"></ngx-doc-viewer>
    </ng-template>
    <button class="btn" (click)="closeModal('pdfPreview')">Close</button>
  </ngx-smart-modal>

  <ngx-smart-modal #confirmation identifier="confirmation">
    <h4 class="heading-tertiary">Are you sure that you want to delete this file</h4>
    <div class="modal__content u-margin-bottom-medium u-margin-top-medium">
      <button class="btn" (click)="deleteFile(fileToRemove)">Yes</button>
      <button class="btn" (click)="closeModal('confirmation')">Cancel</button>
    </div>
  </ngx-smart-modal>

  `,
  styles: [
    `
    `
  ]
})

export class CapFileUploadButtonComponent implements OnInit {
  // Inputs
  @Input() filesToAccept: string[] = [];
  @Input() fileUploaded?: string = 'upload';
  @Input() token: string = '';
  @Input() localStorageRef: ILocalStorage = {
    key: '',
    reference: ''
  };
  @Input() userID: string = 'null';
  @Input() queryFilters: Array<Ifilter> = [];
  @Input() fieldsReference: IReferences[];

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

  tokenRef: string;
  fileToRemove: IAWSFileList;
  typeOfFiles: string = '.pdf, .xml, .doc, .jpg';
  fileURL: string = '';
  selectedFile: any;
  reader = new FileReader();
  progressBar: number = 0;
  listFiles: IAWSFileList[] = [];
  isAnImage: boolean = false;
  p: number = 1;
  loading = false;

  // @Input() fields: IDbFields[] = [];

  constructor(
    private _config: ConfigService,
    private spinner: NgxSpinnerService,
    private requestService: RequestService,
    public ngxSmartModalService: NgxSmartModalService) {

    this.getConfigValues(this._config);
  }

  // Get reference to all the object related with the AWS S3 credentials 
  private getConfigValues(config: awsCredentials) {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
    this.bucket = config.bucket;
    this.folder = config.folder;
    config.endpoint ? this.endpoint = config.endpoint : '';
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
    this.typeOfFiles = this.filesToAccept.join(', ');
    if (this.endpoint) {
      this.loadFilesToList(this.queryFilters, this.fieldsReference);
    }
    this.getLocalStorageRef();
  }

  ngOnInit() {

  }

  private getLocalStorageRef() {
    if (this.localStorageRef.key !== '') {
      // Saving the information into the dataLS variable (Data LocalStorage)
      let dataLS: any = localStorage.getItem(`${this.localStorageRef.key}`);
      if (dataLS !== null) {
        // Converting the response into the objLocal (objectLocal) that makes references 
        // to the Data from the local storage
        let objLocal = JSON.parse(dataLS);

        // Saving the token into the variable token
        this.tokenRef = objLocal[`${this.localStorageRef.reference}`];
      }

    } else {
      if (this.token) {
        this.tokenRef = this.token;
      }
    }
  }

  private async loadFilesToList(filters: Ifilter[], reference: IReferences[]) {
    const dbField = Object.assign({}, ...reference.map(object => ({ [object.propertyName]: object.referenceTo })));
    console.log('dbField: ', dbField);
    let fileElements: any = await this.getFieldsFromApi({ where: { ...filters } })

    this.fillArrayList(fileElements, dbField);
  }

  private fillArrayList(list: any, dbField: any) {

    // Getting the key of the object from the value
    let nameKey = Object.keys(dbField).find(key => dbField[key] === 'name');
    let urlKey = Object.keys(dbField).find(key => dbField[key] === 'url');
    let id = Object.keys(dbField).find(key => dbField[key] === 'id');

    this.listFiles = list.map((element: any) => {
      let newElement: IAWSFileList = { name: '', url: '' };
      if (element[`${nameKey}`]) {
        newElement.name = element[`${nameKey}`]
        newElement.Key = `${this.folder}/${newElement.name}`
      }
      if (element[`${urlKey}`]) {
        newElement.url = element[`${urlKey}`]
      }

      if (element[`${id}`]) {
        newElement.id = element[`${id}`]
      }
      return newElement;
    });
  }

  private getFieldsFromApi(filter: object) {
    return this.requestService.getCapFilesByFilter(filter)
      .toPromise()
      .then((file: [any]) => file)
      .catch(error => [])
  }

  async upload() {
    this.spinner.show();
    const file = this.selectedFile.item(0);
    let fileData = file.name.split('.');

    let currentDate = new Date();
    const timeStamp = currentDate.getTime()
    const params = {
      Bucket: this.bucket,
      Key: `${this.folder}/${fileData[0]}-${timeStamp}.${fileData[1]}`,
      Body: file,
      ACL: 'public-read'
    };
    this.uploadFilesToS3(params, timeStamp);
  }

  private uploadFilesToS3(params: any, timeStamp: number) {
    this.bucketConfig.upload(params, async (err: any, data: any) => {
      if (err) {
        this.dataFileError.emit(err);
        this.loading = false;
        console.log('There was an error uploading your file: ', err);
        this.spinner.hide();
        return false;
      }

      this.dataFile.emit(data);
      let name = data.key.split('/')[1];

      let nameElements = name.split('.')
      let auxName = nameElements[0].split('-');
      name = `${auxName[0]}.${nameElements[1]}`
      console.log('name: ', name);
      let fileData = {
        url: data.Location,
        name: name,
        Key: data.Key,
      }
      if (this.endpoint) {
        console.log('data: ', data);

        this.requestService.createFileRecord(data, this.fieldsReference, this.tokenRef).subscribe((response: any) => {
          console.log('response: ', response);
          const { SACAP__UUID__c: id } = response
          this.listFiles.unshift({ id, ...fileData });
          this.selectedFile = null;
        });
      }
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
    console.log('event: ', event);
    let shouldUploadFile = this.getCurrentFile(event);
    shouldUploadFile ? this.upload() : Swal.fire(
      `Error of type of file`,
      `The type of file is not validate`,
      'error'
    );
  }

  selectFile2(event: any) {
    let typeFile = event.target.files[0].type.split('/');
    if (typeFile[0] === 'image' || typeFile[1] === 'pdf' || typeFile[1] === 'xml') {
    } else {
      // this.toastrService.error('It is not possible to upload files with this type of extension');
    };
  }

  private getCurrentFile(event: any) {
    this.selectedFile = event.target.files;
    this.reader.onload = (event: any) => {
      const image: any = document.getElementById("image");
      image.src = event.target.result;
    }
    const f = event.target.files[0];
    const auxF = event.target.files[0].type.split('/');

    let validation = false;
    this.filesToAccept.forEach(file => {
      if (file === `.${auxF[0]}` || file === `.${auxF[1]}`) {
        validation = true;
      }
    })

    if (validation) {
      this.reader.readAsDataURL(f);
      return validation
    } else {
      return validation
    }

  }

  showContent(file: any) {
    if (file.name.split('.')[1] === 'jpg' || file.name.split('.')[1] === 'png') {
      this.isAnImage = true;
      this.fileURL = file.url;
    } else {
      this.isAnImage = false;
      this.fileURL = file.url;
    }
    this.ngxSmartModalService.getModal('pdfPreview').open()
  }

  closeModal(modalName: string) {
    this.ngxSmartModalService.getModal(modalName).close()
    this.isAnImage = false;
  }

  private delete(params: any, file: IAWSFileList) {
    this.bucketConfig.deleteObject(params, (error: any, data: any) => {
      if (error) {
        Swal.fire(
          `${error.statusText} status ${error.status}`,
          `${error.message}`,
          'error'
        );
      }

      setTimeout(() => {
        Swal.fire(
          'Successful!',
          'File has been deleted successfully',
          'success'
        );

        this.requestService.deleteRecord(file);
        this.listFiles = this.listFiles.filter(element => element.id !== file.id)
        this.closeModal('confirmation');

      }, 200);

      // res.status(200).send("File has been deleted successfully");
    });
  }

  showConfirmation(file: IAWSFileList) {
    this.ngxSmartModalService.getModal('confirmation').open();
    this.fileToRemove = { ...file }
  }


  deleteFile(file: IAWSFileList) {
    console.log('file: ', file);
    const params = {
      Bucket: this.bucket,
      Key: `${file.Key}`
    };
    this.delete(params, file)
  }
}