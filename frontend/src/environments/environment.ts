import {ProjectEnvironmentData} from './symbols/environment.symbols';
import {SettingsLocal} from '../conf/settings-local';
import {AllProjectSettings} from '../conf/symbols/conf.symbols';

/** Environment settings for local. Can be overridden by file replacements. */
export const environment: ProjectEnvironmentData = {
  /** Indicates that the project should work in development mode. */
  production: false,
};

/** General project settings with specific environment settings. */
export const settings: AllProjectSettings = new SettingsLocal();
