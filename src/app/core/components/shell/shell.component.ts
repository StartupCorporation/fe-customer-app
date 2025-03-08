import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "../../../shared/components/popup/popup.component";

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  imports: [RouterOutlet, PopupComponent]
})
export class ShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
