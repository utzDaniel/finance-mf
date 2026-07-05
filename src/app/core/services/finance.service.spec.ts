import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { FinanceService } from './finance.service';
import {
  MonthlySummaryResponse,
  UpdateMonthlySummaryRequest,
} from '../models/finance.model';

describe('FinanceService', () => {
  let service: FinanceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(FinanceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve buscar resumo salarial mensal', () => {
    const competenceDate = '2026-06-01';
    const response: MonthlySummaryResponse = {
      nome: 'Joao',
      sobrenome: 'Silva',
      familyName: 'Silva',
      userGrossSalary: 5500,
      familyGrossSalary: 13200,
      userNetSalary: 4800,
      familyNetSalary: 11800,
    };

    service.getMonthlySummary(competenceDate).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8082/api/v1/finance/salary/summary/2026-06-01',
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deve atualizar resumo salarial mensal', () => {
    const competenceDate = '2026-06-01';
    const payload: UpdateMonthlySummaryRequest = {
      userGrossSalary: 6000,
      userNetSalary: 5100,
    };

    service.updateMonthlySummary(competenceDate, payload).subscribe();

    const req = httpTestingController.expectOne(
      'http://localhost:8082/api/v1/finance/salary/summary/2026-06-01',
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });
});
