import {Settings} from './settings';
import {AllProjectSettings} from './symbols/conf.symbols';

/**
 * Settings for the staging environment.
 */
export class SettingsLocal extends Settings implements AllProjectSettings {
  /** Base URL of the project for the local server environment. */
  coreBaseUrl = 'http://localhost:4200';

  /** Stripe public key. */
  rtStripePublicKey = 'pk_test_51OuW9FIGAmZAeO0aiVaexPCtlzmDn2FySwbfS1TyTUFYLTuTZNz8rJluUpoxMKtZc35z93Bu2VeO0qAr3i6Tlk7N005sKI287A';
}
