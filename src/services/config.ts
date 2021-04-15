import { InjectionToken } from '@angular/core';
import { awsCredentials } from '../interfaces/interface';

export let config = new InjectionToken<awsCredentials>('configCredentials');