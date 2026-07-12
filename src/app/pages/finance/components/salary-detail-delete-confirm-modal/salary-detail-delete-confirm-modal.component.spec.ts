import { SalaryDetailDeleteConfirmModalComponent } from './salary-detail-delete-confirm-modal.component';

describe('SalaryDetailDeleteConfirmModalComponent', () => {
  let component: SalaryDetailDeleteConfirmModalComponent;

  beforeEach(() => {
    component = new SalaryDetailDeleteConfirmModalComponent();
  });

  it('deve iniciar com valores padrão', () => {
    expect(component.visible).toBeFalse();
    expect(component.deleting).toBeFalse();
    expect(component.message).toBe('');
  });

  it('deve emitir evento de close', () => {
    let emitted = false;
    component.close.subscribe(() => {
      emitted = true;
    });

    component.close.emit();

    expect(emitted).toBeTrue();
  });

  it('deve emitir evento de confirm', () => {
    let emitted = false;
    component.confirm.subscribe(() => {
      emitted = true;
    });

    component.confirm.emit();

    expect(emitted).toBeTrue();
  });
});
