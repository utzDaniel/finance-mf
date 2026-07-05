import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../../core/services/finance.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';

import { MonthlySummaryResponse, UpdateMonthlySummaryRequest } from '../../../../core/models/finance.model';

@Component({
  selector: 'app-monthly-summary-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TagModule, InputNumberModule],
  templateUrl: './monthly-summary-card.component.html',
  styles: [`
    :host { display: block; height: 100%; }
    .card { border: 1px solid #e5e7eb; border-radius: .75rem; background: #fff; padding: 1rem; height: 100%; box-sizing: border-box; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-title { font-size: 1.25rem; font-weight: 600; margin: 0; }
    .fields-list { display: flex; flex-direction: column; gap: .75rem; }
    .field-row { display: flex; align-items: center; gap: .75rem; }
    .field-icon { display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: .5rem; flex-shrink: 0; }
    .field-label { font-size: .875rem; color: #6b7280; }
    .field-value { font-weight: 500; }
    .edit-fields { display: flex; flex-direction: column; gap: .75rem; }
    .edit-group { display: flex; flex-direction: column; gap: .25rem; }
    .edit-group label { font-size: .875rem; font-weight: 500; }
    .error-msg { color: #ef4444; font-size: .875rem; }
    .edit-actions { display: flex; gap: .5rem; justify-content: flex-end; }
  `],
})
export class MonthlySummaryCardComponent implements OnInit, OnChanges {

  private readonly financeService = inject(FinanceService);
  private readonly messageService = inject(MessageService);
    
  @Input() competenceDate: string | null = null;

  monthlySummary = signal<MonthlySummaryResponse | null>(null);
  hasFamily = signal(false);

  editMode = signal(false);
  saving = signal(false);

  userGrossSalary: number = 0;
  userNetSalary: number = 0;
  fieldErrors: Record<string, string> = {};

  ngOnInit(): void {
   this.onSearch();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
   if(!changes["competenceDate"].firstChange) {
        this.onSearch();
   }
  }

  onSearch(): void {
    this.financeService.getMonthlySummary(this.competenceDate!)
    .subscribe({
      next: (response) => {
        this.monthlySummary.set(response);
        this.hasFamily.set(!!response.familyName);
      }
    });
  }

  startEdit(): void {
    this.userGrossSalary = this.monthlySummary()!.userGrossSalary;
    this.userNetSalary = this.monthlySummary()!.userNetSalary;
    this.editMode.set(true);
  }

  cancel(): void {
    this.monthlySummary()!.userGrossSalary = this.userGrossSalary;
    this.monthlySummary()!.userNetSalary = this.userNetSalary;
    this.fieldErrors = {};
    this.editMode.set(false);
  }

  save(): void {
    this.fieldErrors = {};
    this.saving.set(true);
    const req: UpdateMonthlySummaryRequest = {
      userGrossSalary: this.userGrossSalary,
      userNetSalary: this.userNetSalary
    };
    this.financeService.updateMonthlySummary(this.competenceDate!, req).subscribe({
      next: (response) => {
        this.monthlySummary.set(response);
        this.editMode.set(false);
        this.saving.set(false);
        this.messageService.add({
          key: 'success',
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dados atualizados com sucesso',
        });
      },
      error: (err) => {
        this.saving.set(false);
        const violacoes: { campo: string; razao: string }[] = err?.error?.violacoes;
        if (violacoes?.length) {
          violacoes.forEach(v => this.fieldErrors[v.campo] = v.razao);
          this.messageService.add({ key: 'error', severity: 'error', summary: 'Erro', detail: 'Verifique os campos destacados' });
          return;
        }
        const msg = err?.error?.message ?? 'Erro ao atualizar dados';
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Erro',
          detail: msg,
        });
      },
    });
  }

}
