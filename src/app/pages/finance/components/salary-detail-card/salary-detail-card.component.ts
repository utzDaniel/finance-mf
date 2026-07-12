import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import {
  AddSalaryDetailRequest,
  DeleteSalaryDetailRequest,
  SalaryDetailPageResponse,
  SalaryDetailResponse,
  SalaryDetailType,
  UpdateSalaryDetailRequest,
} from '../../../../core/models/finance.model';
import { FinanceService } from '../../../../core/services/finance.service';
import {
  SalaryDetailFormModalComponent,
  SalaryDetailFormModalModel,
} from '../salary-detail-form-modal/salary-detail-form-modal.component';
import { SalaryDetailDeleteConfirmModalComponent } from '../salary-detail-delete-confirm-modal/salary-detail-delete-confirm-modal.component';

interface SalaryTypeOption {
  id: SalaryDetailType;
  label: string;
}

@Component({
  selector: 'app-salary-detail-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SalaryDetailFormModalComponent,
    SalaryDetailDeleteConfirmModalComponent,
  ],
  templateUrl: './salary-detail-card.component.html',
  styles: [`
    :host {
      display: block;
      margin-top: 1rem;
    }

    .card {
      border: none;
      border-radius: .75rem;
      background: #fff;
      padding: 1rem;
      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      margin-bottom: 1rem;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      gap: .5rem;
    }

    .card-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: .5rem;
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

    .table-wrap {
      overflow-x: auto;
      border: none;
      border-radius: .625rem;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      min-width: 680px;
      background: #fff;
    }

    th,
    td {
      padding: .75rem .625rem;
      text-align: left;
      font-size: .875rem;
      color: #111827;
      white-space: nowrap;
      vertical-align: middle;
    }

    th {
      font-size: .8125rem;
      color: #111827;
      font-weight: 600;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }

    thead tr {
      border-top: 1px solid #e5e7eb;
    }

    tbody td {
      border-bottom: 1px solid #e5e7eb;
    }

    .cell-actions {
      display: flex;
      gap: .375rem;
    }

    .icon-btn {
      border: 1px solid #dbeafe;
      color: #2563eb;
      background: #eff6ff;
      border-radius: .375rem;
      width: 1.875rem;
      height: 1.875rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .icon-btn:hover {
      background: #dbeafe;
    }

    .icon-btn-danger {
      border-color: #fecaca;
      color: #dc2626;
      background: #fef2f2;
    }

    .icon-btn-danger:hover {
      background: #fee2e2;
    }

    .value-discount {
      color: #dc2626;
      font-weight: 600;
    }

    .value-income {
      color: #059669;
      font-weight: 600;
    }

    .value-benefit {
      color: #6b7280;
      font-weight: 600;
    }

    .list-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: .75rem;
      flex-wrap: wrap;
    }

    .selected-count {
      font-size: .8125rem;
      color: #6b7280;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: .5rem;
      margin-left: auto;
    }

    .pagination button {
      min-width: 2rem;
      padding: .35rem .5rem;
    }

    .page-size {
      border: 1px solid #d1d5db;
      border-radius: .45rem;
      height: 2rem;
      padding: 0 .4rem;
      background: #fff;
    }

    .empty-state {
      border: 1px dashed #d1d5db;
      border-radius: .625rem;
      padding: 1rem;
      color: #6b7280;
      text-align: center;
      margin-top: .5rem;
    }

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
      width: min(680px, 100%);
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

    .field label {
      font-size: .8125rem;
      color: #374151;
      font-weight: 600;
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

    .field-error {
      color: #dc2626;
      font-size: .75rem;
      min-height: .9rem;
    }

    .full {
      grid-column: span 3;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: .5rem;
      padding: 0 1rem 1rem;
    }

    .confirm-text {
      margin: 0;
      color: #374151;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .full {
        grid-column: span 1;
      }

      .pagination {
        width: 100%;
        margin-left: 0;
        justify-content: flex-start;
      }
    }
  `],
})
export class SalaryDetailCardComponent implements OnChanges {
  private readonly financeService = inject(FinanceService);
  private readonly messageService = inject(MessageService);

  @Input() competenceDate: string | null = null;

  salaryPage: SalaryDetailPageResponse | null = null;
  loading = false;

  page = 0;
  size = 10;
  readonly sizeOptions: number[] = [10, 20, 50];

  selectedIds = new Set<number>();
  selectAllChecked = false;

  showDetailModal = false;
  detailModalMode: 'add' | 'edit' = 'add';
  savingDetail = false;

  showDeleteConfirmModal = false;
  deleting = false;
  deleteIds: number[] = [];

  detailForm: SalaryDetailFormModalModel = this.createEmptyForm();

  fieldErrors: Record<string, string> = {};

  readonly typeOptions: SalaryTypeOption[] = [
    { id: SalaryDetailType.Desconto, label: 'Desconto' },
    { id: SalaryDetailType.Provento, label: 'Provento' },
    { id: SalaryDetailType.Beneficio, label: 'Benefício' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    const dateChange = changes['competenceDate'];
    if (!dateChange) {
      return;
    }

    if (!this.competenceDate) {
      this.resetListState();
      return;
    }

    if (dateChange.firstChange || dateChange.previousValue !== dateChange.currentValue) {
      this.page = 0;
      this.loadSalaryDetails(0, this.size);
    }
  }

  get rows(): SalaryDetailResponse[] {
    return this.salaryPage?.content ?? [];
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get totalElements(): number {
    return this.getPageInfo().totalElements;
  }

  get totalPages(): number {
    return this.getPageInfo().totalPages;
  }

  get currentPageNumber(): number {
    const pageInfo = this.getPageInfo();
    if (pageInfo.totalPages === 0) {
      return 0;
    }
    return pageInfo.number + 1;
  }

  get canGoPrevious(): boolean {
    const pageInfo = this.getPageInfo();
    return pageInfo.number > 0;
  }

  get canGoNext(): boolean {
    const pageInfo = this.getPageInfo();
    return pageInfo.number + 1 < pageInfo.totalPages;
  }

  openAddModal(): void {
    this.detailModalMode = 'add';
    this.resetForm();
    this.showDetailModal = true;
  }

  openEditModal(detail: SalaryDetailResponse): void {
    this.detailModalMode = 'edit';
    this.fieldErrors = {};
    this.detailForm = {
      id: detail.id,
      idType: detail.idType,
      code: String(detail.code),
      name: detail.name,
      quantity: String(detail.quantity),
      amount: detail.amount,
    };
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    if (this.savingDetail) {
      return;
    }

    this.showDetailModal = false;
  }

  saveDetail(): void {
    if (!this.competenceDate || !this.validateForm()) {
      return;
    }

    this.savingDetail = true;
    this.fieldErrors = {};

    if (this.detailModalMode === 'add') {
      const request: AddSalaryDetailRequest = {
        idType: this.detailForm.idType!,
        code: Number(this.detailForm.code),
        name: this.detailForm.name.trim(),
        quantity: Number(this.detailForm.quantity),
        amount: Number(this.detailForm.amount),
      };

      this.financeService.addSalaryDetail(this.competenceDate, request, this.page, this.size).subscribe({
        next: (response) => {
          this.applyPageResponse(response);
          this.showDetailModal = false;
          this.savingDetail = false;
          this.messageService.add({
            key: 'success',
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Detalhe salarial adicionado com sucesso',
          });
        },
        error: (err) => {
          this.savingDetail = false;
          this.handleFieldErrors(err, 'Erro ao adicionar detalhe salarial');
        },
      });
      return;
    }

    const request: UpdateSalaryDetailRequest = {
      id: Number(this.detailForm.id),
      idType: this.detailForm.idType!,
      code: Number(this.detailForm.code),
      name: this.detailForm.name.trim(),
      quantity: Number(this.detailForm.quantity),
      amount: Number(this.detailForm.amount),
    };

    this.financeService.updateSalaryDetail(this.competenceDate, request, this.page, this.size).subscribe({
      next: (response) => {
        this.applyPageResponse(response);
        this.showDetailModal = false;
        this.savingDetail = false;
        this.messageService.add({
          key: 'success',
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Detalhe salarial atualizado com sucesso',
        });
      },
      error: (err) => {
        this.savingDetail = false;
        this.handleFieldErrors(err, 'Erro ao atualizar detalhe salarial');
      },
    });
  }

  openDeleteConfirmForRow(detail: SalaryDetailResponse): void {
    this.deleteIds = [detail.id];
    this.showDeleteConfirmModal = true;
  }

  openDeleteConfirmForSelected(): void {
    if (!this.selectedIds.size) {
      return;
    }

    this.deleteIds = Array.from(this.selectedIds);
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    if (this.deleting) {
      return;
    }

    this.showDeleteConfirmModal = false;
  }

  confirmDelete(): void {
    if (!this.competenceDate || !this.deleteIds.length) {
      return;
    }

    const payload: DeleteSalaryDetailRequest = { ids: this.deleteIds };
    this.deleting = true;

    this.financeService.deleteSalaryDetail(this.competenceDate, payload, this.page, this.size).subscribe({
      next: (response) => {
        this.applyPageResponse(response);
        this.deleting = false;
        this.showDeleteConfirmModal = false;
        this.messageService.add({
          key: 'success',
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Detalhe(s) salarial(is) removido(s) com sucesso',
        });
      },
      error: (err) => {
        this.deleting = false;
        const msg = err?.error?.message ?? 'Erro ao remover detalhe(s) salarial(is)';
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Erro',
          detail: msg,
        });
      },
    });
  }

  onToggleSelectAll(): void {
    if (this.selectAllChecked) {
      this.rows.forEach((row) => this.selectedIds.add(row.id));
      return;
    }

    this.rows.forEach((row) => this.selectedIds.delete(row.id));
  }

  onToggleRowSelection(detailId: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(detailId);
    } else {
      this.selectedIds.delete(detailId);
    }

    this.selectAllChecked = this.rows.length > 0 && this.rows.every((row) => this.selectedIds.has(row.id));
  }

  isSelected(detailId: number): boolean {
    return this.selectedIds.has(detailId);
  }

  changePage(nextPage: number): void {
    if (!this.competenceDate || nextPage < 0) {
      return;
    }

    this.loadSalaryDetails(nextPage, this.size);
  }

  onPageSizeChange(value: string | number): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || !this.competenceDate) {
      return;
    }

    this.size = parsed;
    this.loadSalaryDetails(0, parsed);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  getValueClass(idType: SalaryDetailType): string {
    if (idType === SalaryDetailType.Desconto) {
      return 'value-discount';
    }

    if (idType === SalaryDetailType.Provento) {
      return 'value-income';
    }

    return 'value-benefit';
  }

  get deleteConfirmationMessage(): string {
    if (this.deleteIds.length === 1) {
      return 'Deseja remover o detalhe salarial selecionado?';
    }

    return `Deseja remover ${this.deleteIds.length} detalhe(s) salarial(is) selecionado(s)?`;
  }

  private loadSalaryDetails(page: number, size: number): void {
    if (!this.competenceDate) {
      return;
    }

    this.loading = true;
    this.financeService.getSalaryDetail(this.competenceDate, page, size).subscribe({
      next: (response) => {
        this.applyPageResponse(response);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.resetListState();
        const msg = err?.error?.message ?? 'Erro ao carregar detalhes salariais';
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Erro',
          detail: msg,
        });
      },
    });
  }

  private applyPageResponse(response: SalaryDetailPageResponse): void {
    this.salaryPage = response;
    const pageInfo = this.getPageInfo(response);
    this.page = pageInfo.number;
    this.size = pageInfo.size;
    this.selectedIds.clear();
    this.selectAllChecked = false;
    this.deleteIds = [];
  }

  private getPageInfo(source?: SalaryDetailPageResponse): {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  } {
    const response = source ?? this.salaryPage;
    if (!response) {
      return {
        size: this.size,
        number: this.page,
        totalElements: 0,
        totalPages: 0,
      };
    }

    const pagePayload = response.page;
    if (pagePayload) {
      return {
        size: Number(pagePayload.size ?? this.size) || this.size,
        number: Number(pagePayload.number ?? 0) || 0,
        totalElements: Number(pagePayload.totalElements ?? 0) || 0,
        totalPages: Number(pagePayload.totalPages ?? 0) || 0,
      };
    }

    return {
      size: Number(response.size ?? this.size) || this.size,
      number: Number(response.number ?? 0) || 0,
      totalElements: Number(response.totalElements ?? 0) || 0,
      totalPages: Number(response.totalPages ?? 0) || 0,
    };
  }

  private resetListState(): void {
    this.salaryPage = null;
    this.selectedIds.clear();
    this.selectAllChecked = false;
  }

  private resetForm(): void {
    this.fieldErrors = {};
    this.detailForm = this.createEmptyForm();
  }

  private validateForm(): boolean {
    this.fieldErrors = {};

    if (!this.detailForm.idType) {
      this.fieldErrors['idType'] = 'Tipo é obrigatório';
    }

    if (!this.detailForm.code || !/^\d{1,5}$/.test(this.detailForm.code)) {
      this.fieldErrors['code'] = 'Código deve ter de 1 a 5 dígitos';
    }

    if (!this.detailForm.name.trim()) {
      this.fieldErrors['name'] = 'Nome é obrigatório';
    }

    if (this.detailForm.name.trim().length > 100) {
      this.fieldErrors['name'] = 'Nome deve ter até 100 caracteres';
    }

    if (!this.detailForm.quantity || !/^\d{1,3}$/.test(this.detailForm.quantity)) {
      this.fieldErrors['quantity'] = 'Quantidade deve ter de 1 a 3 dígitos';
    }

    if (!this.detailForm.amount || this.detailForm.amount < 1) {
      this.fieldErrors['amount'] = 'Valor deve ser maior que zero';
    }

    return Object.keys(this.fieldErrors).length === 0;
  }

  private createEmptyForm(): SalaryDetailFormModalModel {
    return {
      id: null,
      idType: null,
      code: '',
      name: '',
      quantity: '',
      amount: null,
    };
  }

  private handleFieldErrors(err: unknown, fallbackMessage: string): void {
    const violations = (err as { error?: { violacoes?: { campo: string; razao: string }[] } })?.error?.violacoes;
    if (violations?.length) {
      violations.forEach((violation) => {
        this.fieldErrors[violation.campo] = violation.razao;
      });
      this.messageService.add({
        key: 'error',
        severity: 'error',
        summary: 'Erro',
        detail: 'Verifique os campos destacados',
      });
      return;
    }

    const message = (err as { error?: { message?: string } })?.error?.message ?? fallbackMessage;
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Erro',
      detail: message,
    });
  }
}
