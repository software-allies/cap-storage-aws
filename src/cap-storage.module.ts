import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { StorageService } from './services/storage.service';

import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ConfigService, IConfigService } from './services/config-general.service';
import { CommonModule } from '@angular/common';
import { CapFileUploadComponent } from './components/photo-upload/cap-file-upload.component';
import { CapShowImageComponent } from './components/show-photos/cap-show-image.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        CommonModule,
        CapFileUploadComponent,
        CapShowImageComponent
    ],
    declarations: [
        CapFileUploadComponent,
        CapShowImageComponent
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
