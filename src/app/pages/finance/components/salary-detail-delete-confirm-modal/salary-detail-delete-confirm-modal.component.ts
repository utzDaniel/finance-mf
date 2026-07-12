import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-salary-detail-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-detail-delete-confirm-modal.component.html',
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, .45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
    }

    .modal {
      background: #fff;
      border-radius: .75rem;
      border: 1px solid #e5e7eb;
      width: min(520px, 100%);
      box-shadow: 0 18px 45px rgba(2, 6, 23, .25);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .modal-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
    }

    .close-btn {
      border: none;
      background: transparent;
      color: #6b7280;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
    }

    .modal-body {
      padding: 1rem;
    }

    .confirm-text {
      margin: 0;
      color: #374151;
      line-height: 1.4;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: .5rem;
      padding: 0 1rem 1rem;
    }

    .btn {
      border: 1px solid transparent;
      border-radius: .5rem;
      font-weight: 600;
      font-size: .875rem;
      cursor: pointer;
      padding: .5rem .75rem;
      transition: background-color .15s ease, color .15s ease;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: .55;
    }

    .btn-danger {
      background: #ef4444;
      color: #fff;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
    }

    .btn-outline {
      border-color: #d1d5db;
      background: #fff;
      color: #374151;
    }

    .btn-outline:hover:not(:disabled) {
      background: #f9fafb;
    }
  `],
})
export class SalaryDetailDeleteConfirmModalComponent {
  @Input() visible = false;
  @Input() deleting = false;
  @Input() message = '';

  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly confirm = new EventEmitter<void>();
}
