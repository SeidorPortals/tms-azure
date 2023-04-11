import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ FooterComponent ],
    exports: [ FooterComponent ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FooterModule {}
