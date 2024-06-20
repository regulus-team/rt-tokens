import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the dev environment.
 */
export class SettingsDevelop extends Settings implements AllProjectSettings {
  public override coreBaseUrl = 'https://dev.rt-tokens.io/';
}
