import {CoreProjectSettings} from './symbols/conf.symbols';

/**
 * The core settings class.
 * Contains general settings presented in all projects.
 */
export class CoreSettings implements CoreProjectSettings {
  /** The current environment site URL. Will be overwritten by the environment file. */
  coreBaseUrl = 'http://localhost:4200';
}
