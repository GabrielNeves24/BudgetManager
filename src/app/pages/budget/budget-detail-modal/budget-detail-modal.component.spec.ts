import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDetailModalComponent } from './budget-detail-modal.component';

describe('BudgetDetailModalComponent', () => {
  let component: BudgetDetailModalComponent;
  let fixture: ComponentFixture<BudgetDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
