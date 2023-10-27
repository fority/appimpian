import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    SearchboxComponent,
    SharedModule,
  ],
})
export class SettingsModule {}
