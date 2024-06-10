import {CoreProjectSettings} from './symbols/conf.symbols';

import {NetCluster} from '../app/rt-solana/symbols';

/**
 * The core settings class.
 * Contains general settings presented in all projects.
 */
export class CoreSettings implements CoreProjectSettings {
  public coreBaseUrl = 'http://localhost:4200';
  public currentNetCluster: NetCluster = 'devnet';
}
