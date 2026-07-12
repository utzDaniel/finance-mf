import { FinanceSearchCardComponent } from './finance-search-card.component';

describe('FinanceSearchCardComponent', () => {
  let component: FinanceSearchCardComponent;

  beforeEach(() => {
    component = new FinanceSearchCardComponent();
  });

  it('deve iniciar com data selecionada', () => {
    expect(component.selectedCompetenceDate).toBeTruthy();
  });

  it('deve emitir alteração de competência', () => {
    const emitted: Array<Date | null> = [];
    component.selectedCompetenceDateChange.subscribe((value) => emitted.push(value));

    const value = new Date('2026-06-01');
    component.selectedCompetenceDateChange.emit(value);

    expect(emitted).toEqual([value]);
  });

  it('deve emitir evento de busca', () => {
    let emitted = false;
    component.search.subscribe(() => {
      emitted = true;
    });

    component.search.emit();

    expect(emitted).toBeTrue();
  });
});
