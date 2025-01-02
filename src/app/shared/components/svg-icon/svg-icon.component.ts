import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent {

  @Input() icon!: string;
  @Input() size = '24';
  @Input() color = 'white';

  get iconLink() {
    return 'assets/icons/' + this.icon + '.svg#' +  this.icon;
  }
}
