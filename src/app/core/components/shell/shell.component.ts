import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  imports: [RouterOutlet]
})
export class ShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
