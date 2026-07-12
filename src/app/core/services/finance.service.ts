import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AddSalaryDetailRequest,
  DeleteSalaryDetailRequest,
  MonthlySummaryResponse,
  SalaryDetailPageResponse,
  UpdateMonthlySummaryRequest,
  UpdateSalaryDetailRequest,
} from '../models/finance.model';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiFinanceUrl}/api/v1/finance`;

  getMonthlySummary(competenceDate: string): Observable<MonthlySummaryResponse> {
    return this.http.get<MonthlySummaryResponse>(`${this.baseUrl}/summary/${competenceDate}`);
  }

  updateMonthlySummary(
    competenceDate: string,
    payload: UpdateMonthlySummaryRequest,
  ): Observable<MonthlySummaryResponse> {
    return this.http.put<MonthlySummaryResponse>(`${this.baseUrl}/summary/${competenceDate}`, payload);
  }

  getSalaryDetail(
    competenceDate: string,
    page = 0,
    size = 10,
  ): Observable<SalaryDetailPageResponse> {
    const params = this.createPageParams(page, size);
    return this.http.get<SalaryDetailPageResponse>(`${this.baseUrl}/salary/${competenceDate}/detail`, { params });
  }

  addSalaryDetail(
    competenceDate: string,
    payload: AddSalaryDetailRequest,
    page = 0,
    size = 10,
  ): Observable<SalaryDetailPageResponse> {
    const params = this.createPageParams(page, size);
    return this.http.post<SalaryDetailPageResponse>(`${this.baseUrl}/salary/${competenceDate}/detail`, payload, { params });
  }

  updateSalaryDetail(
    competenceDate: string,
    payload: UpdateSalaryDetailRequest,
    page = 0,
    size = 10,
  ): Observable<SalaryDetailPageResponse> {
    const params = this.createPageParams(page, size);
    return this.http.put<SalaryDetailPageResponse>(`${this.baseUrl}/salary/${competenceDate}/detail`, payload, { params });
  }

  deleteSalaryDetail(
    competenceDate: string,
    payload: DeleteSalaryDetailRequest,
    page = 0,
    size = 10,
  ): Observable<SalaryDetailPageResponse> {
    const params = this.createPageParams(page, size);
    return this.http.delete<SalaryDetailPageResponse>(`${this.baseUrl}/salary/${competenceDate}/detail`, {
      params,
      body: payload,
    });
  }

  private createPageParams(page: number, size: number): HttpParams {
    return new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
  }
}
