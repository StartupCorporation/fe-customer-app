import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "../../../shared/components/popup/popup.component";
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  imports: [RouterOutlet, PopupComponent]
})
export class ShellComponent implements OnInit {
  isPopupVisible = false;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.isCartVisible$.subscribe(isVisible => {
      this.isPopupVisible = isVisible;
    });
  }

  closeModal() {
    this.cartService.hideCart();
  }
}
