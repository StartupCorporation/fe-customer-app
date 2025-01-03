import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { ScrollService } from 'src/app/shared/services/scroll.service';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: ['./landing-navbar.component.scss']
})
export class LandingNavbarComponent implements OnInit {

  constructor(private scrollService: ScrollService) {}
  ngOnInit() {
  }
  
  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }

}
