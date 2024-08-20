import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPdfComponent } from './budget-pdf.component';

describe('BudgetPdfComponent', () => {
  let component: BudgetPdfComponent;
  let fixture: ComponentFixture<BudgetPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
