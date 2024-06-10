import {animate, keyframes, style, transition, trigger} from '@angular/animations';

/**
 * Item appears with fade in effect.
 */
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [animate('.3s', keyframes([style({height: 0, opacity: 0}), style({height: '*'}), style({opacity: 1})]))]),
]);
