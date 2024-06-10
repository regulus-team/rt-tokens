import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * Item toggles opacity between 0.5 and 1.
 */
export const opacityHalfAnimation = trigger('opacityHalf', [
  state('true', style({opacity: 0.5})),
  state('false', style({opacity: 1})),
  transition('false => true', [animate(300)]),
  transition('true => false', [animate(200)]),
]);
