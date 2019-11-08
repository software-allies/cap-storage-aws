import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { StorageService } from './services/storage.service';

import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ConfigService, IConfigService } from './services/config-general.service';
import { CommonModule } from '@angular/common';
import { CapFileUploadComponent } from './components/photo-upload/cap-file-upload.component';
import { CapShowImageComponent } from './components/show-photos/cap-show-image.component';
import { CapFileUploadDragDropComponent } from './components/photo-upload/cap-file-upload-drag-drop.component';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
    imports: [
        CommonModule,
        NgxFileDropModule
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
    static forRoot(config:IConfigService): ModuleWithProviders{
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
