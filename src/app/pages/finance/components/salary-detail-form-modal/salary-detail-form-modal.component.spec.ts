import { SalaryDetailType } from '../../../../core/models/finance.model';
import { SalaryDetailFormModalComponent } from './salary-detail-form-modal.component';

describe('SalaryDetailFormModalComponent', () => {
  let component: SalaryDetailFormModalComponent;

  beforeEach(() => {
    component = new SalaryDetailFormModalComponent();
    component.model = {
      id: null,
      idType: SalaryDetailType.Desconto,
      code: '',
      name: '',
      quantity: '',
      amount: null,
    };
  });

  it('deve bloquear tecla não numérica no keydown', () => {
    const event = {
      key: 'a',
      ctrlKey: false,
      metaKey: false,
      preventDefault: jasmine.createSpy('preventDefault'),
    } as unknown as KeyboardEvent;

    component.onDigitsKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('deve aceitar tecla numérica no keydown', () => {
    const event = {
      key: '5',
      ctrlKey: false,
      metaKey: false,
      preventDefault: jasmine.createSpy('preventDefault'),
    } as unknown as KeyboardEvent;

    component.onDigitsKeydown(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('deve sanitizar input de código', () => {
    const input = document.createElement('input');
    input.value = 'ab12c3456';

    component.onDigitsInput({ target: input } as unknown as Event, 'code', 5);

    expect(component.model.code).toBe('12345');
    expect(input.value).toBe('12345');
  });

  it('deve sanitizar input de quantidade', () => {
    const input = document.createElement('input');
    input.value = 'q1w2e3r4';

    component.onDigitsInput({ target: input } as unknown as Event, 'quantity', 3);

    expect(component.model.quantity).toBe('123');
    expect(input.value).toBe('123');
  });

  it('deve sanitizar valor colado', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      clipboardData: {
        getData: () => 'ab12c3',
      },
    } as unknown as ClipboardEvent;

    component.onDigitsPaste(event, 'quantity', 3);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.model.quantity).toBe('123');
  });
});
