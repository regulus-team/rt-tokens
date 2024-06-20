import {animate, keyframes, style, transition, trigger} from '@angular/animations';

/**
 * Item disappears with fade out effect.
 */
export const fadeOutAnimation = trigger('fadeOut', [
  transition(':leave', [animate('.3s', keyframes([style({height: '*', opacity: 1}), style({opacity: 0}), style({height: 0})]))]),
]);
