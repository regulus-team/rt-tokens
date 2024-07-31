import {CoreProjectSettings} from './symbols/conf.symbols';

import {NetCluster} from '../app/rt-solana/symbols';

/**
 * The core settings class.
 * Contains general settings presented in all projects.
 */
export class CoreSettings implements CoreProjectSettings {
  public coreBaseUrl = 'http://localhost:4200';

  /** The current network cluster. */
  public currentNetCluster: NetCluster = 'devnet';

  /** API Endpoint to Pinata gateway. */
  public pinataApiGatewayUrl = 'https://gateway.pinata.cloud/ipfs';

  /** API Endpoint to Pinata service. */
  public pinataApiUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  /** API key for the Pinata service. */
  public pinataApiKey = 'YOUR_API_KEY';

  /** Secret key for the Pinata service. */
  public pinataApiKeySecret = 'YOUR_API_SECRET';
}
