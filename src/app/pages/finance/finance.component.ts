import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './finance.component.html',
  styles: [`
    :host {
      --p-primary-50: #eff6ff;
      --p-primary-100: #dbeafe;
      --p-primary-200: #bfdbfe;
      --p-primary-300: #93c5fd;
      --p-primary-400: #60a5fa;
      --p-primary-500: #3b82f6;
      --p-primary-600: #2563eb;
      --p-primary-700: #1d4ed8;
      --p-primary-800: #1e40af;
      --p-primary-900: #1e3a8a;
      --p-primary-950: #172554;
      --p-primary-color: #3b82f6;
      --p-primary-hover-color: #2563eb;
      --p-primary-active-color: #1d4ed8;
      --p-primary-contrast-color: #ffffff;
      /* Button primary (filled) */
      --p-button-primary-background: #3b82f6;
      --p-button-primary-hover-background: #2563eb;
      --p-button-primary-active-background: #1d4ed8;
      --p-button-primary-border-color: #3b82f6;
      --p-button-primary-hover-border-color: #2563eb;
      --p-button-primary-active-border-color: #1d4ed8;
      --p-button-primary-color: #ffffff;
      --p-button-primary-focus-ring-color: #3b82f6;
      /* Button primary (outlined) */
      --p-button-outlined-primary-border-color: #bfdbfe;
      --p-button-outlined-primary-color: #3b82f6;
      --p-button-outlined-primary-hover-background: #eff6ff;
      --p-button-outlined-primary-hover-border-color: #bfdbfe;
      --p-button-outlined-primary-hover-color: #2563eb;
    }
    .page-wrap { padding: 1rem; }
    .page-header { display: flex; align-items: center; gap: .75rem; margin-bottom: .25rem; }
    .page-title { font-size: 1.875rem; font-weight: 700; margin: 0; }
    .page-icon { display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; }
    .breadcrumb { font-size: .875rem; color: #6b7280; margin-bottom: 1.5rem; margin-left: 3.25rem; }
    .profile-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem; }
    @media (min-width: 768px) { .profile-grid { grid-template-columns: 1fr 1fr; } }
    .loading-card { border: 1px solid #e5e7eb; border-radius: .75rem; padding: 1rem;
      display: flex; align-items: center; justify-content: center; min-height: 200px; }
  `],
})
export class FinanceComponent implements OnInit {


  ngOnInit(): void {
    // Initialization logic here
  }

}
