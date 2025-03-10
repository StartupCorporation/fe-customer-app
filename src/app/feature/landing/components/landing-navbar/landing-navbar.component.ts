import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Router } from '@angular/router';
import { Observable, map, first } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: ['./landing-navbar.component.scss'],
  imports: [AsyncPipe],
  standalone: true
})
export class LandingNavbarComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  @Input() isHomePage$!: Observable<boolean>;

  cartItemsCount$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(private scrollService: ScrollService) {}

  scrollTo(sectionId: string) {
    this.isHomePage$.pipe(first()).subscribe(isHomePage => {
      if (isHomePage) {
        // Already on home page, just scroll
        this.scrollService.scrollToTarget(sectionId);
      } else {
        // Navigate to home page first, then scroll after navigation completes
        this.router.navigate(['/home']).then(() => {
          // Use setTimeout to ensure the DOM has updated after navigation
          setTimeout(() => {
            this.scrollService.scrollToTarget(sectionId);
          }, 100);
        });
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  openCart() {
    this.cartService.showCart();
  }
}
