import {Injectable} from '@angular/core';
import {CoreSettings} from './core-settings';
import {AllProjectSettings} from './symbols/conf.symbols';

@Injectable()
export class Settings extends CoreSettings implements AllProjectSettings {
  /** Public key for the stripe service. */
  rtStripePublicKey = null;

  /** Relative URL of the RT Auth login page on the frontend. */
  rtAuthLoginUrl = '/auth/login/';

  /** Relative URL of the main page that should be open after successful login on the frontend. */
  rtAuthLoginRedirectUrl = '/dashboard';

  /** Contain primary way to authenticate user. */
  rtAuthAuthenticationMethod: 'email' | 'username' = 'email';

  /** Indicates whether the email verification is required. */
  rtAuthEmailVerificationNecessity: 'mandatory' = 'mandatory';

  /** Indicates whether the manual approval for each new account is required. */
  rtAuthIsAccountApproveRequired = false;

  /** Indicates whether the user has to verify email before proceeding to the email creation. */
  rtAuthIsVerificationRequiredBeforeCreation = true;

  /** Redirect URL for redirecting anonymous user after email confirmation. */
  rtAuthConfirmedEmailAnonymousRedirectUrl = null;

  /** Redirect URL for redirecting authenticated user after email confirmation. */
  rtAuthConfirmedEmailAuthenticatedRedirectUrl = null;

  /** Maximum number of messages that can be displayed on the page. */
  rtMessagesItemsOnPageLimit = 6;

  /** Time in milliseconds for how long the message should be displayed on the page if during that time the url was changed. */
  rtMessagesItemOnPageTimeAfterRedirect = 6000;

  /** Time in milliseconds for how long the message should be displayed on the page if during that time the url was not changed. */
  rtMessagesItemOnPageTimeOnSameUrl = 5000;

  /** Default caption for the page title. */
  rtTitlesDefaultCaption = 'Art Metric';

  /** Separator for the page title parts. */
  rtTitlesSeparator = ' - ';
}
