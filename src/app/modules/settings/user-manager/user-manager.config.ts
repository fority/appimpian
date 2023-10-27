import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { ViewUserComponent } from './view/view-user.component';

export const MANAGERROUTE: Route[] = [
  {
    path: 'view',
    component: ViewUserComponent,
  },
  {
    path: 'update/:id',
    component: UpdateComponent,
  },
];

export const MANAGER_MODULE = [CommonModule];
