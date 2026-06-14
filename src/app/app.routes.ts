import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/finance/finance.component').then((m) => m.FinanceComponent),
  },
];
