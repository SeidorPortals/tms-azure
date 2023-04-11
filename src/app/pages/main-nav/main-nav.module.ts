import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './main-nav.routing';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminLayoutModule {}
