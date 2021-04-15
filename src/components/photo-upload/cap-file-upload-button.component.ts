import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '../../services/config-general.service';
@Component({
  selector: 'cap-upload-button',
  template: `
  <div class="files-upload__container">
      <h4>
        Attachments
      </h4>
      <div>
        Payroll receipts, XML, .doc, .pdf
      </div>

      <div class="file__list" *ngFor="let file of files | paginate: { itemsPerPage: 5, currentPage: p }">
        <div class="file__container">
          <div class="file__info">
            <div class="file-icon"><i class="bi bi-file-earmark-bar-graph"></i></div>
            <label class="file__name">{{file.name}}</label>
          </div>
          <div class="file__options">
            <button class="btn file__btn" (click)="upload()"><i class="bi bi-eye" data-toggle="modal" data-target="#exampleModal"></i></button>
            <button class="btn file__btn" (click)="upload()"><i class="bi bi-cloud-arrow-down-fill"></i></button>
            <button class="btn file__btn" (click)="upload()"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
      <div class="file__pagination">
        <pagination-controls (pageChange)="p = $event"></pagination-controls>
      </div>
      <div class="upload__container">
        <img id="image" src="" class="">
        <input type="file" class="input__file" accept=".pdf, .xml, .doc, .jpg" name="file" id="file"
          (change)="selectFile($event)">
        <label class="btn upload__button" for="file">Upload file</label>
      </div>
    </div>

  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    Launch demo modal
  </button>

  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
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
    &__list {
      display: flex;
      max-height: 25rem;
      flex-direction: column;
      &:not(:last-child){
        border-bottom: .2rem solid rgb(219, 208, 208);
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
        background-image: linear-gradient(120deg, rgba(219, 219, 219, 0.603) 0%, rgba(255, 253, 253, 0.767) 100%);
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
    }
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
      background-image: linear-gradient(120deg, #35a4fb 0%, #35a5fb88 100%);
      cursor: pointer;
    }
  }
  
  `]
})

export class CapFileUploadButtonComponent implements OnInit {
  @Input() fileUploaded?: string = 'upload';
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
  selectedFile: any;
  reader = new FileReader();
  progressBar: number = 0;

  p: number = 1;
  files: any[] = [
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/books.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/k.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/books.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/k.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'tres',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Uno',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/books.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'cinco',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/k.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'matocas 2',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/books.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/k.jpg',
    }, {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Matocas',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/books.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Testing',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/219431-2.jpg',
    },
    {
      name: 'Felicity',
      format: 'jpg',
      url: 'https://sa-cap-prject.s3.amazonaws.com/testing/k.jpg',
    }
  ]

  constructor(private _config: ConfigService) {
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

  upload() {
    const file = this.selectedFile.item(0);
    let fn: any;
    const params = {
      Bucket: this.bucket,
      Key: `${this.folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };
    console.log('params: ', params);
    this.bucketConfig.upload(params, (err: any, data: any) => {
      if (err) {
        this.dataFileError.emit(err);
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      this.dataFile.emit(data);
    }).on('httpUploadProgress', (progress: any) => {

      this.progressBar = Math.round((progress.loaded * 100) / progress.total);
      if (progress.loaded == progress.total) {
        setTimeout(() => {
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
  }

  showFile() {

  }

  downloadFile() {

  }

}