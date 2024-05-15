import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsProd extends Settings implements AllProjectSettings {
  /** Base URL of the project for the production server environment. */
  coreBaseUrl = 'https://artmetric.regulus.team';

  /** Stripe public key. */
  rtStripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
}
