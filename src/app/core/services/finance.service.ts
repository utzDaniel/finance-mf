import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  MonthlySummaryResponse,
  UpdateMonthlySummaryRequest,
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
}
