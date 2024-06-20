import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';
import {NetCluster} from '../app/rt-solana/symbols';

/**
 * Settings for the production environment.
 */
export class SettingsProd extends Settings implements AllProjectSettings {
  public override coreBaseUrl = 'https://artmetric.regulus.team';
  public override currentNetCluster: NetCluster = 'mainnet-beta';
}
