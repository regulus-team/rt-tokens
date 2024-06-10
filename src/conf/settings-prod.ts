import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsProd extends Settings implements AllProjectSettings {
  /** Base URL of the project for the production server environment. */
  public override coreBaseUrl = 'https://artmetric.regulus.team';
}
