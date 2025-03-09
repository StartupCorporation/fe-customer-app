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
import { Observable, map } from 'rxjs';
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
    this.scrollService.scrollToTarget(sectionId);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  openCart() {
    this.cartService.showCart();
  }
}
