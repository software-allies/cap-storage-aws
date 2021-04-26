// Angular's import
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';

// Services
import { StorageService } from './services/storage.service';
import { ConfigService } from './services/config-general.service';

// Components
import { CapFileUploadComponent } from './components/photo-upload/cap-file-upload.component';
import { CapShowImageComponent } from './components/show-photos/cap-show-image.component';
import { CapFileUploadDragDropComponent } from './components/photo-upload/cap-file-upload-drag-drop.component';
import { CapFileUploadButtonComponent } from './components/photo-upload/cap-file-upload-button.component';

// Libraries
import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ModalModule } from 'angular-custom-modal';

// Interfaces
import { awsCredentials } from './interfaces/interface';

// Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    PdfViewerModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxFileDropModule,
    NgxDocViewerModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ModalModule
  ],
  exports: [
    CommonModule,
    CapShowImageComponent,
    CapFileUploadComponent,
    CapFileUploadButtonComponent,
    CapFileUploadDragDropComponent
  ],
  declarations: [
    CapShowImageComponent,
    CapFileUploadComponent,
    CapFileUploadButtonComponent,
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
