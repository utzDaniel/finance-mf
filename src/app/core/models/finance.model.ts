export interface MonthlySummaryResponse {
  nome: string;
  sobrenome: string;
  familyName: string;
  userGrossSalary: number;
  familyGrossSalary: number;
  userNetSalary: number;
  familyNetSalary: number;
}

export interface UpdateMonthlySummaryRequest {
  userGrossSalary: number;
  userNetSalary: number;
}
