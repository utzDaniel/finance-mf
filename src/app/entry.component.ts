import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'finance-mf-entry',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class EntryComponent {}
