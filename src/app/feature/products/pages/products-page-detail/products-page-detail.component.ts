import { Component, OnInit } from '@angular/core';
import { LandingFooterComponent } from "../../../landing/components/landing-footer/landing-footer.component";
import { LandingWelcomeWindowComponent } from "../../../landing/components/landing-welcome-window/landing-welcome-window.component";

@Component({
  selector: 'app-products-page-detail',
  templateUrl: './products-page-detail.component.html',
  styleUrls: ['./products-page-detail.component.scss'],
  imports: [LandingFooterComponent, LandingWelcomeWindowComponent]
})
export class ProductsPageDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
