import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { MonthlySummaryCardComponent } from './monthly-summary-card.component';
import { FinanceService } from '../../../../core/services/finance.service';
import { MonthlySummaryResponse } from '../../../../core/models/finance.model';

describe('MonthlySummaryCardComponent', () => {
  let component: MonthlySummaryCardComponent;
  let fixture: ComponentFixture<MonthlySummaryCardComponent>;
  let financeServiceSpy: jasmine.SpyObj<FinanceService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const summary: MonthlySummaryResponse = {
    nome: 'Joao',
    sobrenome: 'Silva',
    familyName: 'Silva',
    userGrossSalary: 5500,
    familyGrossSalary: 13200,
    userNetSalary: 4800,
    familyNetSalary: 11800,
  };

  beforeEach(async () => {
    financeServiceSpy = jasmine.createSpyObj<FinanceService>('FinanceService', [
      'getMonthlySummary',
      'updateMonthlySummary',
    ]);
    messageServiceSpy = jasmine.createSpyObj<MessageService>('MessageService', ['add']);

    financeServiceSpy.getMonthlySummary.and.returnValue(of(summary));
    financeServiceSpy.updateMonthlySummary.and.returnValue(of(summary));

    await TestBed.configureTestingModule({
      imports: [MonthlySummaryCardComponent],
      providers: [
        { provide: FinanceService, useValue: financeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlySummaryCardComponent);
    component = fixture.componentInstance;
    component.competenceDate = '2026-06-01';
  });

  it('deve carregar resumo no ngOnInit', () => {
    fixture.detectChanges();

    expect(financeServiceSpy.getMonthlySummary).toHaveBeenCalledWith('2026-06-01');
    expect(component.monthlySummary()).toEqual(summary);
    expect(component.hasFamily()).toBeTrue();
  });

  it('deve entrar em modo edição com valores atuais', () => {
    component.monthlySummary.set(summary);

    component.startEdit();

    expect(component.editMode()).toBeTrue();
    expect(component.userGrossSalary).toBe(5500);
    expect(component.userNetSalary).toBe(4800);
  });

  it('deve salvar com sucesso e sair do modo edição', () => {
    component.monthlySummary.set(summary);
    component.competenceDate = '2026-06-01';
    component.userGrossSalary = 6000;
    component.userNetSalary = 5100;
    component.editMode.set(true);

    component.save();

    expect(financeServiceSpy.updateMonthlySummary).toHaveBeenCalledWith('2026-06-01', {
      userGrossSalary: 6000,
      userNetSalary: 5100,
    });
    expect(component.editMode()).toBeFalse();
    expect(component.saving()).toBeFalse();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve preencher erros de campo ao receber violacoes', () => {
    financeServiceSpy.updateMonthlySummary.and.returnValue(
      throwError(() => ({
        error: {
          violacoes: [
            { campo: 'userNetSalary', razao: 'Inválido' },
          ],
        },
      })),
    );

    component.competenceDate = '2026-06-01';
    component.userGrossSalary = 6000;
    component.userNetSalary = 5100;

    component.save();

    expect(component.fieldErrors['userNetSalary']).toBe('Inválido');
    expect(component.saving()).toBeFalse();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });
});
