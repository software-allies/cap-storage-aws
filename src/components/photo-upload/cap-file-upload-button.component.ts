import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAWSFileList, IDbFields, ILocalStorage, IFilterBy, awsCredentials, IReferences, Ifilter } from '../../interfaces/interface';
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '../../services/config-general.service';
import { NgxSpinnerService } from "ngx-spinner";
import { RequestService } from '../../services/request.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import Swal from 'sweetalert2';

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

  <ngx-smart-modal #confirmation identifier="confirmation" class="modal">
    <h4 class="heading-tertiary">Are you sure that you want to delete this file</h4>
    <div class="modal__content u-margin-bottom-medium u-margin-top-medium">
      <button class="btn" (click)="deleteFile(fileToRemove)">Yes</button>
      <button class="btn" (click)="closeModal('confirmation')">Cancel</button>
    </div>
  </ngx-smart-modal>

  `,
  styles: [
    `
    .btn {
      &,
      &:link,
      &:visited {
        font-size: 1.5rem;
        text-transform: uppercase;
        text-decoration: none;
        padding: 1rem 2.5rem;
        display: inline-block;
        transition: all 0.3s;
        border-radius: 1rem;
        position: relative;
    
        @include responsive(phone) {
          font-size: 2rem;
        }
      }
    
      &:hover,
      &:focus {
        outline: none;
        transform: translateY(-0.3rem);
        box-shadow: 0 1rem 2rem rgba($color-black, $alpha: 0.2);
      }
      &:active {
        transform: translateY(-0.1rem);
        box-shadow: 0 0.5rem 1rem rgba($color-black, $alpha: 0.2);
      }
    }

    .files-upload__container {
      display: flex;
      font-size: 1.8rem;
      width: 50%;
      flex-direction: column;
      justify-content: flex-end;
      align-self: stretch;
      margin: 0 1rem;
    }
    .file {
      &__visor {
        display: none;
      }
      &__list {
        display: flex;
        max-height: 25rem;
        flex-direction: column;
        &:not(:last-child) {
          border-bottom: 0.2rem solid $color-gray;
        }
      }
      &__icon {
        margin: 0rem 2rem;
      }
      &__container {
        display: inherit;
        align-items: center;
        justify-content: space-between;
        &:hover {
          background-image: linear-gradient(120deg, $color-gray-dark-transparent 0%, $color-white-light 100%);
        }
      }
      &__pagination {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
      }
      &__info {
        display: flex;
        justify-content: space-between;
        margin: 1rem 2rem;
      }
      &__name {
        margin-left: 3rem;
        max-width: 40rem;
        min-width: 20rem;
      }
      &__options {
        display: inherit;
        justify-content: space-around;
      }
      &__btn {
        font-size: 1.8rem;
        margin: 0 0.5rem;
        text-decoration: none;
      }
    
      &__btn--link {
        &:link,
        &:visited {
          font-size: 1.5rem;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1rem 2.5rem;
          display: inline-block;
          transition: all 0.3s;
          border-radius: 1rem;
          position: relative;
    
          @include responsive(phone) {
            font-size: 2rem;
          }
        }
    
        &:hover,
        &:focus {
          outline: none;
          transform: translateY(-0.3rem);
          box-shadow: 0 1rem 2rem rgba($color-black, $alpha: 0.2);
        }
        &:active {
          transform: translateY(-0.1rem);
          box-shadow: 0 0.5rem 1rem rgba($color-black, $alpha: 0.2);
        }
      }
      &__list--empty{
        display: flex;
        justify-content: center;
        font-size: 1.8rem;
      }
    }
    
    .spinner{
      font-size: 1.8rem;
      margin-top: 1.5rem;
      color: $color-white;
    }
    
    .input__file {
      display: none;
    }
    
    .upload {
      &__container {
        display: flex;
        justify-content: flex-end;
      }
      &__button {
        position: relative;
        text-align: center;
        width: 30%;
        color: $color-white;
        background-image: linear-gradient(120deg, $color-primary-light 0%, $color-blue-transparent 100%);
        cursor: pointer;
      }
    }
    `
  ]
})

export class CapFileUploadButtonComponent implements OnInit {
  // Inputs
  @Input() filesToAccept: string[] = [];
  @Input() fileUploaded?: string = 'upload';
  @Input() token: string = '';
  @Input() fields: IDbFields[] = [];
  @Input() localStorageRef: ILocalStorage = {
    key: '',
    reference: ''
  };
  @Input() userID: string = 'null';
  @Input() queryFilters: Array<Ifilter> = [];

  // It's going to recive the fields that are related with the name and the url of the file
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
  public loading = false;

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
    const params = {
      Bucket: this.bucket,
      Key: `${this.folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };
    this.uploadFilesToS3(params);
  }

  private uploadFilesToS3(params: any) {
    console.log('this.endpoint: ', this.endpoint);
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
      if (this.endpoint) await this.requestService.createFileRecord(data, this.fields, this.tokenRef);
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

        if(this.endpoint){
          this.requestService.deleteRecord(file);
        }
        this.listFiles.pop();
        this.closeModal('confirmation');

      }, 200);

      // res.status(200).send("File has been deleted successfully");
    });
  }

  showConfirmation(file: IAWSFileList) {
    this.ngxSmartModalService.getModal('confirmation').open();
    this.fileToRemove = file
  }


  deleteFile(file: IAWSFileList) {
    const params = {
      Bucket: this.bucket,
      Key: `${file.name}`
    };
    this.delete(params, file)
  }
}