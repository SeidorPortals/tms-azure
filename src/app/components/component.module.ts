import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UploadCsvComponent } from './attachments/upload-csv/upload-csv.component';
//import { PreloadAllModules, RouterModule, Routes } from '@angular/router';




@NgModule({
  declarations: [
  
    // UploadCsvComponent
  ],
  exports:[

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
