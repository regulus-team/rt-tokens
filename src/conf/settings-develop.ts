import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsDevelop extends Settings implements AllProjectSettings {
  /** Base URL of the project for the development server environment. */
  public override coreBaseUrl = 'https://dev.artmetric.io/';
}
