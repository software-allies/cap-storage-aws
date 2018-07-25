import { StorageService } from '../../services/storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cap-img-list',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col col-12 col-sm-9 col-md-6 col-lg-4 col-xl-3 *ngFor="let image of images">
                    <ion-card>
                        <img src="{{ image.url}}"/>
                        <ion-card-content>
                        <ion-card-title>
                            {{image.name}}
                            </ion-card-title>
                        </ion-card-content>
                    </ion-card>   
                </ion-col>
            </ion-row>
        </ion-grid>
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
    images:any = [];
    constructor( private _fileUpload: StorageService ) {
        this.showFiles()
    }

    ngOnInit() {}

    showFiles(){
        this.images = this._fileUpload.getFiles();
    }

}