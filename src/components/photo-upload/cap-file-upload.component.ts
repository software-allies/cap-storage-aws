import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { StorageService } from '../../services/storage.service';


@Component({
    selector: 'cap-upload',
    template: `
        <ion-grid>
            <ion-row *ngIf="selectedFile">
                <ion-col col-12 col-md-6 offset-md-3 >
                    <ion-card >
                        <img id="image" src=""/>
                        <div class="progress-outer">
                            <span>{{ progressBar }}%</span>
                            <div class="progress-inner" [style.width]="progressBar + '%'"></div>
                        </div>
                    </ion-card>
                    <div class="fileUpload btn btn-primary">
                        <span>
                            <button ion-button full>
                                Search a file
                            </button>
                        </span>
                        <input type="file" name="file" accept="image/*" id="file" class="upload" id="file" (change)="selectFile($event)" />
                        <button ion-button full [disabled]="!selectedFile" (click)="upload()">Upload</button>
                    </div>
                </ion-col>
            </ion-row>
            <ion-row *ngIf="!selectedFile">
                <ion-col col-md-6 offset-md-3>
                    <ion-card>
                        <div class="imageNotFound">Photo</div>
                    </ion-card>
                    <div class="fileUpload btn btn-primary">
                        <span>
                            <button ion-button full>
                                Search a file
                            </button>
                        </span>
                        <input type="file" name="file" accept="image/*" id="file" class="upload" id="file" (change)="selectFile($event)" />
                        <button ion-button full [disabled]="!selectedFile" (click)="upload()">Upload</button>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
    `,
    styles: [
        `
            .card-background-page {
                ion-card {
                    position: relative;
                    text-align: center;
                }
          
                .card-title {
                    position: absolute;
                    top: 36%;
                    font-size: 2.0em;
                    width: 100%;
                    font-weight: bold;
                    color: #fff;
                }
          
                .card-subtitle {
                    font-size: 1.0em;
                    position: absolute;
                    top: 50%;
                    width: 100%;
                    color: #fff;
                }
            }
            
            .fileUpload {
                position: relative;
                overflow: hidden;
                margin: 10px;
            }
            .fileUpload input.upload {
                position: absolute;
                top: 0;
                right: 0;
                margin: 0;
                padding: 0;
                cursor: pointer;
                opacity: 0;
                filter: alpha(opacity=0);
                height: 100%;

            }
           
            .upload{
                width: 100%;
            }
            .progress-outer {
                width: 96%;
                margin: 10px 2%;
                padding: 3px;
                text-align: center;
                background-color: #B6C9E2;
                border: 1px solid #dcdcdc;
                color: white;
                border-radius: 20px;
                height: 20px;
            }

            .progress-outer span {
                position: relative;
                bottom: 2px;
                left: 0;
                z-index: 1;
            }

            .progress-inner {
                text-align: center;
                min-width: 0%;
                white-space: nowrap;
                overflow: hidden;
                padding: 0px;
                border-radius: 20px;
                background-color: #3EA548;
                transition: width 1s;
                height: 15px;
                position: relative;
                top: -17px;
            }     
            
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
    totalSize:any;
    progressBar:number = 0;
    selectedFile: any;
    reader = new FileReader();
 
    constructor(private uploadService: StorageService, private alertCtrl: AlertController) {}

    ngOnInit() {}

    upload() {
        const file = this.selectedFile.item(0);
        this.uploadService.upload(file, (progress:any) => {
            this.progressBar =  Math.round( (progress.loaded * 100)/progress.total);
            if(progress.loaded == progress.total){
                setTimeout(() =>{
                    this.showAlert();
                    this.selectedFile = null;
                    this.progressBar = 0; 
                }, 1500)
            }
        }); 
    }
     
    selectFile(event:any) {
        this.selectedFile = event.target.files;
        console.log("selected files: ", this.selectedFile)

        this.reader.onload = ( event:any ) => {
            const image:any = document.getElementById("image");
            image.src = event.target.result;
            console.log(image)
        }
        const f = event.target.files[0];
        this.reader.readAsDataURL(f);
    }

    showAlert(){
        const alert = this.alertCtrl.create({
            title: 'Successful upload',
            subTitle: 'Your image has been successfully loaded!',
            buttons: ['OK']
        });
        alert.present();
    }
}