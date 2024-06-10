import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsStag extends Settings implements AllProjectSettings {
  /** Base URL of the project for the staging server environment. */
  public override coreBaseUrl = 'https://stag.artmetric.regulus.team';
}
