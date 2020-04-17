import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';

import { StorageService } from './services/storage.service';
import { ConfigService } from './services/config-general.service';

import { CapFileUploadComponent } from './components/photo-upload/cap-file-upload.component';
import { CapShowImageComponent } from './components/show-photos/cap-show-image.component';
import { CapFileUploadDragDropComponent } from './components/photo-upload/cap-file-upload-drag-drop.component';

import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClientModule } from '@angular/common/http';

import { awsCredentials } from './interfaces/interface';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [
    CommonModule,
    CapFileUploadComponent,
    CapShowImageComponent,
    CapFileUploadDragDropComponent
  ],
  declarations: [
    CapFileUploadComponent,
    CapShowImageComponent,
    CapFileUploadDragDropComponent
  ],
  providers: [StorageService],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CapStorageAWS {
  static forRoot(config: awsCredentials): ModuleWithProviders {
    return {
      ngModule: CapStorageAWS,
      providers: [
        {
          provide: ConfigService,
          useValue: config
        }
      ]
    }
  }
}
