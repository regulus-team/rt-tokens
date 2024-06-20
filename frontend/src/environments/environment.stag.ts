import {ProjectEnvironmentData} from './symbols/environment.symbols';
import {SettingsStag} from '../conf/settings-stag';
import {AllProjectSettings} from '../conf/symbols/conf.symbols';

/** Environment settings for staging. Can be overridden by file replacements. */
export const environment: ProjectEnvironmentData = {
  /** Indicates that the project should work in production-like mode. */
  production: true,
};

/** General project settings with specific environment settings. */
export const settings: AllProjectSettings = new SettingsStag();
