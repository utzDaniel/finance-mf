import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { FinanceService } from './finance.service';
import {
  AddSalaryDetailRequest,
  DeleteSalaryDetailRequest,
  MonthlySummaryResponse,
  SalaryDetailPageResponse,
  SalaryDetailType,
  UpdateMonthlySummaryRequest,
  UpdateSalaryDetailRequest,
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
      'http://localhost:8082/api/v1/finance/summary/2026-06-01',
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
      'http://localhost:8082/api/v1/finance/summary/2026-06-01',
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deve buscar detalhes salariais paginados', () => {
    const competenceDate = '2026-06-01';
    const response: SalaryDetailPageResponse = {
      content: [
        {
          id: 10007,
          idType: SalaryDetailType.Desconto,
          code: 301,
          name: 'INSS',
          quantity: 1,
          amount: 10.5,
        },
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };

    service.getSalaryDetail(competenceDate, 0, 10).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpTestingController.expectOne((request) =>
      request.url === `http://localhost:8082/api/v1/finance/salary/${competenceDate}/detail` &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '10',
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deve adicionar detalhe salarial', () => {
    const competenceDate = '2026-06-01';
    const payload: AddSalaryDetailRequest = {
      idType: SalaryDetailType.Provento,
      code: 301,
      name: 'Bonus',
      quantity: 1,
      amount: 10.5,
    };

    service.addSalaryDetail(competenceDate, payload, 0, 10).subscribe();

    const req = httpTestingController.expectOne((request) =>
      request.url === `http://localhost:8082/api/v1/finance/salary/${competenceDate}/detail` &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '10',
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deve atualizar detalhe salarial', () => {
    const competenceDate = '2026-06-01';
    const payload: UpdateSalaryDetailRequest = {
      id: 10007,
      idType: SalaryDetailType.Beneficio,
      code: 301,
      name: 'Vale',
      quantity: 1,
      amount: 10.5,
    };

    service.updateSalaryDetail(competenceDate, payload, 0, 10).subscribe();

    const req = httpTestingController.expectOne((request) =>
      request.url === `http://localhost:8082/api/v1/finance/salary/${competenceDate}/detail` &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '10',
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deve remover detalhe salarial', () => {
    const competenceDate = '2026-06-01';
    const payload: DeleteSalaryDetailRequest = {
      ids: [10007, 10008],
    };

    service.deleteSalaryDetail(competenceDate, payload, 0, 10).subscribe();

    const req = httpTestingController.expectOne((request) =>
      request.url === `http://localhost:8082/api/v1/finance/salary/${competenceDate}/detail` &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '10',
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });
});
