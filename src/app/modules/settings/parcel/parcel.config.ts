import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';
import { SaveParcelComponent } from './save/save-parcel.component';
import { ViewComponent } from './view/view.component';

export const IOTROUTE: Route[] = [
  {
    path: 'view',
    component: ViewComponent,
  },
  {
    path: 'create',
    component: SaveParcelComponent,
  },
  {
    path: 'update/:id',
    component: SaveParcelComponent,
  },
];

export const IOT_MODULE = [CommonModule];
