import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsStag extends Settings implements AllProjectSettings {
  public override coreBaseUrl = 'https://staging.rt-tokens.io/';
}
