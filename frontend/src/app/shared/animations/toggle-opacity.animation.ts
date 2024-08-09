import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';

/**
 * Item toggles opacity between provided values.
 */
export const toggleOpacityAnimation = (startOpacity = 0, endOpacity = 1): AnimationTriggerMetadata =>
  trigger('toggleOpacity', [
    state('true', style({opacity: startOpacity})),
    state('false', style({opacity: endOpacity})),
    transition('false => true', [animate(300)]),
    transition('true => false', [animate(200)]),
  ]);
