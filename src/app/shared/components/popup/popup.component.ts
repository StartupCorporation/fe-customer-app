import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() popupTitle = 'Popup title';
  @Output() popupCloseEvent = new EventEmitter();
  
  ngOnInit() {
  }

  closeModal() {
    this.popupCloseEvent.emit();
  }
}
