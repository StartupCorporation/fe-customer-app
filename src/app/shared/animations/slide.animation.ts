import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  transition(':increment', group([
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      animate('400ms ease-out', style({
        opacity: 1,
        transform: 'translateX(0)'
      }))
    ]),
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 1
      }),
      animate('400ms ease-out', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }))
    ])
  ])),
  transition(':decrement', group([
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('400ms ease-out', style({
        opacity: 1,
        transform: 'translateX(0)'
      }))
    ]),
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 1
      }),
      animate('400ms ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ]))
]);
