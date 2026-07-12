import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SalaryDetailPageResponse, SalaryDetailType } from '../../../../core/models/finance.model';
import { FinanceService } from '../../../../core/services/finance.service';
import { SalaryDetailCardComponent } from './salary-detail-card.component';
import { MessageService } from 'primeng/api';

describe('SalaryDetailCardComponent', () => {
  let component: SalaryDetailCardComponent;
  let fixture: ComponentFixture<SalaryDetailCardComponent>;
  let financeServiceSpy: jasmine.SpyObj<FinanceService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const pageResponse: SalaryDetailPageResponse = {
    content: [
      {
        id: 10007,
        idType: SalaryDetailType.Desconto,
        code: 301,
        name: 'Item 1',
        quantity: 1,
        amount: 10.5,
      },
      {
        id: 10008,
        idType: SalaryDetailType.Provento,
        code: 302,
        name: 'Item 2',
        quantity: 2,
        amount: 20,
      },
    ],
    page: {
      size: 10,
      number: 0,
      totalElements: 2,
      totalPages: 1,
    },
  };

  beforeEach(async () => {
    financeServiceSpy = jasmine.createSpyObj<FinanceService>('FinanceService', [
      'getSalaryDetail',
      'addSalaryDetail',
      'updateSalaryDetail',
      'deleteSalaryDetail',
    ]);
    messageServiceSpy = jasmine.createSpyObj<MessageService>('MessageService', ['add']);

    financeServiceSpy.getSalaryDetail.and.returnValue(of(pageResponse));
    financeServiceSpy.addSalaryDetail.and.returnValue(of(pageResponse));
    financeServiceSpy.updateSalaryDetail.and.returnValue(of(pageResponse));
    financeServiceSpy.deleteSalaryDetail.and.returnValue(of(pageResponse));

    await TestBed.configureTestingModule({
      imports: [SalaryDetailCardComponent],
      providers: [
        { provide: FinanceService, useValue: financeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryDetailCardComponent);
    component = fixture.componentInstance;
  });

  it('deve carregar detalhes ao trocar competência', () => {
    component.competenceDate = '2026-06-01';

    component.ngOnChanges({
      competenceDate: new SimpleChange(null, '2026-06-01', true),
    });

    expect(financeServiceSpy.getSalaryDetail).toHaveBeenCalledWith('2026-06-01', 0, 10);
    expect(component.rows.length).toBe(2);
    expect(component.totalElements).toBe(2);
    expect(component.currentPageNumber).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.size).toBe(10);
  });

  it('deve selecionar e desselecionar todas as linhas', () => {
    component.salaryPage = pageResponse;

    component.selectAllChecked = true;
    component.onToggleSelectAll();
    expect(component.selectedCount).toBe(2);

    component.selectAllChecked = false;
    component.onToggleSelectAll();
    expect(component.selectedCount).toBe(0);
  });

  it('deve abrir confirmação de remoção para selecionados', () => {
    component.salaryPage = pageResponse;
    component.onToggleRowSelection(10007, true);
    component.onToggleRowSelection(10008, true);

    component.openDeleteConfirmForSelected();

    expect(component.showDeleteConfirmModal).toBeTrue();
    expect(component.deleteIds).toEqual([10007, 10008]);
  });

  it('deve confirmar remoção e atualizar a lista', () => {
    component.salaryPage = pageResponse;
    component.competenceDate = '2026-06-01';
    component.deleteIds = [10007, 10008];
    component.showDeleteConfirmModal = true;

    component.confirmDelete();

    expect(financeServiceSpy.deleteSalaryDetail).toHaveBeenCalledWith(
      '2026-06-01',
      { ids: [10007, 10008] },
      0,
      10,
    );
    expect(component.showDeleteConfirmModal).toBeFalse();
    expect(component.rows.length).toBe(2);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve mapear classe de valor por tipo', () => {
    expect(component.getValueClass(SalaryDetailType.Desconto)).toBe('value-discount');
    expect(component.getValueClass(SalaryDetailType.Provento)).toBe('value-income');
    expect(component.getValueClass(SalaryDetailType.Beneficio)).toBe('value-benefit');
  });
});
