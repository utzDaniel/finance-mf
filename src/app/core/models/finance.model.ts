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

export enum SalaryDetailType {
  Desconto = 1,
  Provento = 2,
  Beneficio = 3,
}

export interface SalaryDetailResponse {
  id: number;
  idType: SalaryDetailType;
  code: number;
  name: string;
  quantity: number;
  amount: number;
}

export interface SalaryDetailPageResponse {
  content: SalaryDetailResponse[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface AddSalaryDetailRequest {
  idType: SalaryDetailType;
  code: number;
  name: string;
  quantity: number;
  amount: number;
}

export interface UpdateSalaryDetailRequest {
  id: number;
  idType: SalaryDetailType;
  code: number;
  name: string;
  quantity: number;
  amount: number;
}

export interface DeleteSalaryDetailRequest {
  ids: number[];
}
