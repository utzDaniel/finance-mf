import { FinanceComponent } from './finance.component';

describe('FinanceComponent', () => {
  let component: FinanceComponent;

  beforeEach(() => {
    component = new FinanceComponent();
  });

  it('deve inicializar competência e pesquisar no ngOnInit', () => {
    component.ngOnInit();

    expect(component.competenceDate).toBeTruthy();
    expect(component.searchCompetenceDate).toBe(component.competenceDate);
    expect(component.competenceDateValid).toBeFalse();
  });

  it('deve invalidar quando a data for nula', () => {
    component.onCompetenceDateSelect(null);

    expect(component.competenceDateValid).toBeFalse();
  });

  it('deve atualizar competência quando selecionar mês diferente', () => {
    component.competenceDate = '2026-06-01';

    component.onCompetenceDateSelect(new Date('2026-07-15'));

    expect(component.competenceDate).toBe('2026-07-01');
    expect(component.competenceDateValid).toBeTrue();
  });

  it('deve copiar competência para busca ao pesquisar', () => {
    component.competenceDate = '2026-08-01';
    component.competenceDateValid = true;

    component.onSearch();

    expect(component.searchCompetenceDate).toBe('2026-08-01');
    expect(component.competenceDateValid).toBeFalse();
  });
});
