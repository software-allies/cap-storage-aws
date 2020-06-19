import { StorageService } from '../services/storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cap-img-list',
  template: `

        <div class="row">
          <div class="col-12 col-md-3" *ngFor="let image of images">

          <div class="card-deck">
            <div class="card">
              <img src="{{ image.url}}" class="card-img-top" alt="...">

              <div class="card-footer">
                <small class="text-muted">{{image.name}}</small>
              </div>
            </div>


          </div>
        </div>
    `,
  styles: [
    `
        ion-card-title {
            text-align: center;
            font-weight: bold;
        }
        `
  ]
})

export class CapShowImageComponent implements OnInit {
  images: any = [];
  constructor(private _fileUpload: StorageService) {
    this.showFiles();
  }

  ngOnInit() { }

  showFiles() {
    this.images = this._fileUpload.getFiles();
  }

}
