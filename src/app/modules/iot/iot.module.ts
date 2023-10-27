import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { IotRoutingModule } from './iot-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IotRoutingModule,
    ReactiveFormsModule,
    SearchboxComponent,
    SharedModule,
  ],
})
export class IotModule {}
