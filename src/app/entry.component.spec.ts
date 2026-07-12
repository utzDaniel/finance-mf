import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EntryComponent } from './entry.component';

describe('EntryComponent', () => {
  it('deve criar o entry component', async () => {
    await TestBed.configureTestingModule({
      imports: [EntryComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(EntryComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});
