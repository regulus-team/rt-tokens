import {Injectable} from '@angular/core';
import {CoreSettings} from './core-settings';
import {AllProjectSettings} from './symbols/conf.symbols';

@Injectable({providedIn: 'root'})
export class Settings extends CoreSettings implements AllProjectSettings {}
