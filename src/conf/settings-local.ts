import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsLocal extends Settings implements AllProjectSettings {
  /** Base URL of the project for the local server environment. */
  public override coreBaseUrl = 'http://localhost:4200';
}
