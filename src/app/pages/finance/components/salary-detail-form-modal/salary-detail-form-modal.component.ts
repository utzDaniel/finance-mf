import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { SalaryDetailType } from '../../../../core/models/finance.model';

export interface SalaryDetailFormModalModel {
  id: number | null;
  idType: SalaryDetailType | null;
  code: string;
  name: string;
  quantity: string;
  amount: number | null;
}

@Component({
  selector: 'app-salary-detail-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule],
  templateUrl: './salary-detail-form-modal.component.html',
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
      width: min(560px, 100%);
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: .75rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }

    .form-grid .field > label {
      font-size: .625rem !important;
      color: #374151;
      font-weight: 400 !important;
      line-height: 1.15;
    }

    .field input,
    .field select {
      border: 1px solid #d1d5db;
      border-radius: .5rem;
      height: 2.25rem;
      padding: 0 .65rem;
      font-size: .875rem;
      outline: none;
      background: #fff;
    }

    .field input:focus,
    .field select:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, .16);
    }

    :host ::ng-deep #salary-detail-input-amount .p-inputnumber-input {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: .5rem;
      height: 2.25rem;
      padding: 0 .65rem;
      font-size: .875rem;
      outline: none;
      background: #fff;
    }

    .field-error {
      color: #dc2626;
      font-size: .75rem;
      min-height: .9rem;
    }

    .span-2 {
      grid-column: span 2;
    }

    .full {
      grid-column: span 3;
    }

    .selected-count {
      font-size: .8125rem;
      color: #6b7280;
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

    .btn-primary {
      background: #2563eb;
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .btn-outline {
      border-color: #d1d5db;
      background: #fff;
      color: #374151;
    }

    .btn-outline:hover:not(:disabled) {
      background: #f9fafb;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .span-2,
      .full {
        grid-column: span 1;
      }
    }
  `],
})
export class SalaryDetailFormModalComponent {
  @Input() visible = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() saving = false;
  @Input({ required: true }) model!: SalaryDetailFormModalModel;
  @Input() fieldErrors: Record<string, string> = {};
  @Input() typeOptions: Array<{ id: SalaryDetailType; label: string }> = [];

  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<void>();

  onDigitsKeydown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onDigitsInput(event: Event, field: 'code' | 'quantity', maxLength: number): void {
    if (!this.model) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const sanitized = String(input.value ?? '').replace(/\D/g, '').slice(0, maxLength);
    input.value = sanitized;
    this.model[field] = sanitized;
  }

  onDigitsPaste(event: ClipboardEvent, field: 'code' | 'quantity', maxLength: number): void {
    if (!this.model) {
      return;
    }

    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') ?? '';
    const sanitized = pastedText.replace(/\D/g, '').slice(0, maxLength);
    this.model[field] = sanitized;
  }
}
