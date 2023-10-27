import { InjectionToken } from '@angular/core';
import { ConfigData } from '../shared/models/iApiUrl';

export const CONFIG_DATA = new InjectionToken<ConfigData>('api url');
